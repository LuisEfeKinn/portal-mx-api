import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { ProgressService } from 'src/progress/services/progress.service'
import { BulkUploadJobEntity } from 'src/shared/entities/bulkUploadJob.entity'
import { UserRepository } from 'src/shared/repositories/user.repository'
import { UploadFileService } from 'src/shared/services/uploadFile.service'
import { DataSource } from 'typeorm'
import * as xlsx from 'xlsx'
import { BulkUploadError, BulkUploadRowRaw } from '../dtos/bulkUpload.dto'
import { BulkUploadJobRepository } from '../repositories/bulkUploadJob.repository'
import { RolRepository } from '../repositories/rol.repository'
import { UserRoleRepository } from '../repositories/userRol.repository'

const BATCH_SIZE = 500
const HASH_CONCURRENCY = 50
const BCRYPT_ROUNDS_BULK = 8 // menor costo para bulk — usuarios deben cambiar contraseña al primer login

@Injectable()
export class BulkUploadService implements OnModuleInit {
  private readonly logger = new Logger(BulkUploadService.name)

  constructor(
    private readonly userRepository: UserRepository,
    private readonly rolRepository: RolRepository,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly jobRepository: BulkUploadJobRepository,
    private readonly uploadFileService: UploadFileService,
    private readonly dataSource: DataSource,
    private readonly progressService: ProgressService,
  ) {}

  // Al iniciar el servidor: recuperar jobs que quedaron en 'processing' por caída
  async onModuleInit() {
    const stuck = await this.jobRepository.find({
      where: { status: 'processing' },
    })
    if (!stuck.length) return

    await this.jobRepository.save(
      stuck.map((job) => ({
        ...job,
        status: 'failed' as const,
        errorMessage:
          'El procesamiento fue interrumpido por un reinicio del servidor. Por favor, sube el archivo nuevamente.',
        completedAt: new Date(),
      })),
    )
    this.logger.warn(
      `${stuck.length} job(s) recuperados de estado 'processing' tras reinicio`,
    )
  }

  async enqueue(file: Express.Multer.File): Promise<BulkUploadJobEntity> {
    // 1. Subir archivo original a S3
    const s3Result = await this.uploadFileService.s3_upload(
      file.buffer,
      process.env.AWS_BUCKET_NAME,
      `bulk-uploads/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
      file.mimetype,
    )

    // biome-ignore lint/style/useNamingConvention: AWS SDK usa PascalCase para Location
    const fileUrl = (s3Result as { Location?: string }).Location ?? ''

    // 2. Crear el job
    const job = await this.jobRepository.save(
      this.jobRepository.create({
        status: 'pending',
        fileName: file.originalname,
        fileUrl,
        total: 0,
        insertados: 0,
        omitidos: 0,
        erroresCount: 0,
      }),
    )

    // 3. Disparar procesamiento en background (desacoplado del request)
    setImmediate(() => this.process(job.id, file.buffer))

    return job
  }

  getJob(jobId: string): Promise<BulkUploadJobEntity | null> {
    return this.jobRepository.findOneBy({ id: jobId })
  }

  findAll(
    page: number,
    perPage: number,
  ): Promise<[BulkUploadJobEntity[], number]> {
    return this.jobRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: perPage * page - perPage,
      take: perPage,
    })
  }

  private async process(jobId: string, buffer: Buffer) {
    const job = await this.jobRepository.findOneBy({ id: jobId })
    if (!job) return

    await this.jobRepository.save({ ...job, status: 'processing' })

    try {
      const userRole = await this.rolRepository.findOneBy({ key: 'user' })
      if (!userRole)
        throw new Error('Rol "user" no encontrado — ejecuta los seeders')

      const rows = this.parseExcel(buffer)
      const errors: BulkUploadError[] = []
      let insertados = 0
      let omitidos = 0

      // Validar filas
      const valid: { row: number; data: BulkUploadRowRaw }[] = []
      for (let i = 0; i < rows.length; i++) {
        const raw = rows[i]
        const fila = i + 2
        const correo = raw.correo?.toString().trim().toLowerCase()
        const nombre = raw.nombre?.toString().trim()
        const apellido = raw.apellido?.toString().trim()
        const identificacion = raw.identificacion?.toString().trim()
        const contrasena = raw.contrasena?.toString().trim()

        if (!correo) {
          errors.push({ fila, correo: '', motivo: 'Correo vacío' })
          continue
        }
        if (!nombre) {
          errors.push({ fila, correo, motivo: 'Nombre vacío' })
          continue
        }
        if (!apellido) {
          errors.push({ fila, correo, motivo: 'Apellido vacío' })
          continue
        }
        if (!identificacion) {
          errors.push({ fila, correo, motivo: 'Identificación vacía' })
          continue
        }
        if (!contrasena) {
          errors.push({ fila, correo, motivo: 'Contraseña vacía' })
          continue
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
          errors.push({ fila, correo, motivo: 'Formato de correo inválido' })
          continue
        }

        valid.push({
          row: fila,
          data: {
            ...raw,
            correo,
            nombre,
            apellido,
            identificacion,
            contrasena,
          },
        })
      }

      // Detectar duplicados dentro del mismo archivo
      const seenInFile = new Set<string>()
      const deduplicated: typeof valid = []
      for (const item of valid) {
        const email = item.data.correo as string
        if (seenInFile.has(email)) {
          errors.push({
            fila: item.row,
            correo: email,
            motivo: 'Correo duplicado dentro del archivo',
          })
        } else {
          seenInFile.add(email)
          deduplicated.push(item)
        }
      }

      // Detectar emails ya existentes en BD
      const allEmails = deduplicated.map((v) => v.data.correo as string)
      const existingEmails = await this.getExistingEmails(allEmails)

      const toInsert = deduplicated.filter((v) => {
        if (existingEmails.has(v.data.correo as string)) {
          omitidos++
          return false
        }
        return true
      })

      await this.jobRepository.save({
        ...job,
        total: rows.length,
        status: 'processing',
      })

      // Procesar en lotes
      for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
        const batch = toInsert.slice(i, i + BATCH_SIZE)
        const hashed = await this.hashBatch(
          batch.map((b) => b.data.contrasena as string),
        )

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
          for (let j = 0; j < batch.length; j++) {
            const item = batch[j]
            const user = this.userRepository.create({
              email: item.data.correo as string,
              firstName: item.data.nombre,
              secondName: item.data.segundo_nombre || undefined,
              firstLastname: item.data.apellido,
              secondLastname: item.data.segundo_apellido || undefined,
              identification: item.data.identificacion,
              password: hashed[j],
              isActive: true,
              acceptedTerms: true,
            })
            const saved = await queryRunner.manager.save(user)
            await queryRunner.manager.save(
              this.userRoleRepository.create({
                userId: saved.id,
                roleId: userRole.id,
              }),
            )
            insertados++
          }

          await queryRunner.commitTransaction()
        } catch (err) {
          await queryRunner.rollbackTransaction()
          for (const item of batch) {
            errors.push({
              fila: item.row,
              correo: item.data.correo as string,
              motivo: `Error de base de datos: ${(err as Error).message}`,
            })
            insertados--
          }
        } finally {
          await queryRunner.release()
        }

        // Actualizar progreso tras cada lote
        await this.jobRepository.save({
          ...job,
          insertados,
          omitidos,
          erroresCount: errors.length,
        })
      }

      // Generar reporte de errores en S3 si hay errores
      let reportUrl: string | undefined
      if (errors.length > 0) {
        reportUrl = await this.uploadErrorReport(job.id, errors)
      }

      await this.jobRepository.save({
        ...job,
        status: 'done',
        total: rows.length,
        insertados,
        omitidos,
        erroresCount: errors.length,
        reportUrl,
        completedAt: new Date(),
      })

      this.logger.log(
        `Job ${job.id} completado — ${insertados} insertados, ${omitidos} omitidos, ${errors.length} errores`,
      )
    } catch (err) {
      await this.jobRepository.save({
        ...job,
        status: 'failed',
        errorMessage: (err as Error).message,
        completedAt: new Date(),
      })
      this.logger.error(`Job ${job.id} fallido: ${(err as Error).message}`)
    }
  }

  private parseExcel(buffer: Buffer): BulkUploadRowRaw[] {
    const workbook = xlsx.read(buffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    return xlsx.utils.sheet_to_json<BulkUploadRowRaw>(sheet, { defval: '' })
  }

  private async getExistingEmails(emails: string[]): Promise<Set<string>> {
    if (!emails.length) return new Set()
    const found = await this.userRepository
      .createQueryBuilder('u')
      .select('u.email')
      .where('u.email IN (:...emails)', { emails })
      .getMany()
    return new Set(found.map((u) => u.email))
  }

  private async hashBatch(passwords: string[]): Promise<string[]> {
    const result: string[] = []
    for (let i = 0; i < passwords.length; i += HASH_CONCURRENCY) {
      const chunk = passwords.slice(i, i + HASH_CONCURRENCY)
      const hashed = await Promise.all(
        chunk.map((p) => bcrypt.hash(p, BCRYPT_ROUNDS_BULK)),
      )
      result.push(...hashed)
    }
    return result
  }

  /**
   * Procesa un Excel con correos de quienes presentaron el examen.
   * Marca el hito "application" como completado para cada usuario encontrado.
   */
  async processExamResults(
    announcementId: number,
    buffer: Buffer,
  ): Promise<{ procesados: number; noEncontrados: number }> {
    const emails = this.parseEmailList(buffer)
    return await this.markMilestoneForEmails(emails, announcementId, 'application')
  }

  /**
   * Procesa un Excel con correos de reaplicantes que presentaron el examen.
   * Marca el hito "certificate_upload" como completado para cada usuario encontrado.
   */
  async processReapplicationResults(
    announcementId: number,
    buffer: Buffer,
  ): Promise<{ procesados: number; noEncontrados: number }> {
    const emails = this.parseEmailList(buffer)
    return await this.markMilestoneForEmails(
      emails,
      announcementId,
      'certificate_upload',
    )
  }

  private parseEmailList(buffer: Buffer): string[] {
    const workbook = xlsx.read(buffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = xlsx.utils.sheet_to_json<{ correo?: string }>(sheet, {
      defval: '',
    })
    return rows
      .map((r) => r.correo?.toString().trim().toLowerCase())
      .filter((e): e is string => !!e)
  }

  private async markMilestoneForEmails(
    emails: string[],
    announcementId: number,
    milestoneKey: string,
  ): Promise<{ procesados: number; noEncontrados: number }> {
    if (!emails.length) return { procesados: 0, noEncontrados: 0 }

    const found = await this.userRepository
      .createQueryBuilder('u')
      .select('u.id')
      .where('u.email IN (:...emails)', { emails })
      .getMany()

    const userIds = found.map((u) => Number(u.id))
    await this.progressService.markMilestoneByKeyBulk(
      userIds,
      announcementId,
      milestoneKey,
    )

    return {
      procesados: userIds.length,
      noEncontrados: emails.length - userIds.length,
    }
  }

  private async uploadErrorReport(
    jobId: string,
    errors: BulkUploadError[],
  ): Promise<string> {
    const ws = xlsx.utils.json_to_sheet(
      errors.map((e) => ({
        fila: e.fila,
        correo: e.correo,
        motivo: e.motivo,
      })),
    )
    const wb = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(wb, ws, 'Errores')
    const buffer = xlsx.write(wb, {
      type: 'buffer',
      bookType: 'xlsx',
    }) as Buffer

    const result = await this.uploadFileService.s3_upload(
      buffer,
      process.env.AWS_BUCKET_NAME,
      `bulk-reports/${jobId}-errores.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )

    // biome-ignore lint/style/useNamingConvention: AWS SDK usa PascalCase para Location
    return (result as { Location?: string }).Location ?? ''
  }
}

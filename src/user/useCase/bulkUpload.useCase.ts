import { Injectable, NotFoundException } from '@nestjs/common'
import { ProgressService } from 'src/progress/services/progress.service'
import { BulkUploadService } from '../services/bulkUpload.service'

@Injectable()
export class BulkUploadUseCase {
  constructor(
    private readonly bulkUploadService: BulkUploadService,
    private readonly progressService: ProgressService,
  ) {}

  async upload(file: Express.Multer.File) {
    const job = await this.bulkUploadService.enqueue(file)
    return {
      jobId: job.id,
      mensaje: 'Archivo recibido. El procesamiento está en curso.',
      estado: job.status,
    }
  }

  async findAll(page: number, perPage: number) {
    const [jobs, totalItems] = await this.bulkUploadService.findAll(
      page,
      perPage,
    )
    const totalPages = Math.ceil(totalItems / perPage)
    return {
      rows: jobs.map((job) => ({
        jobId: job.id,
        estado: job.status,
        archivo: job.fileName,
        total: job.total,
        insertados: job.insertados,
        omitidos: job.omitidos,
        errores: job.erroresCount,
        reporteErrores: job.reportUrl ?? null,
        creadoEn: job.createdAt,
        completadoEn: job.completedAt ?? null,
      })),
      metadata: {
        totalItems,
        totalPages,
        itemsPerPage: perPage,
        currentPage: page,
        nextPage: totalPages - page <= 0 ? null : page + 1,
        searchTerm: '',
      },
    }
  }

  async uploadExamResults(announcementId: number, file: Express.Multer.File) {
    const result = await this.progressService.processExamResults(
      announcementId,
      file.buffer,
    )
    return {
      mensaje: 'Resultados de examen procesados correctamente.',
      ...result,
    }
  }

  async uploadReapplicationResults(
    announcementId: number,
    file: Express.Multer.File,
  ) {
    const result = await this.progressService.processReapplicationResults(
      announcementId,
      file.buffer,
    )
    return {
      mensaje: 'Resultados de reaplicación procesados correctamente.',
      ...result,
    }
  }

  async status(jobId: string) {
    const job = await this.bulkUploadService.getJob(jobId)
    if (!job) throw new NotFoundException('Job no encontrado')

    return {
      jobId: job.id,
      estado: job.status,
      archivo: job.fileName,
      fileUrl: job.fileUrl,
      total: job.total,
      insertados: job.insertados,
      omitidos: job.omitidos,
      errores: job.erroresCount,
      reporteErrores: job.reportUrl ?? null,
      mensajeError: job.errorMessage ?? null,
      creadoEn: job.createdAt,
      completadoEn: job.completedAt ?? null,
    }
  }
}

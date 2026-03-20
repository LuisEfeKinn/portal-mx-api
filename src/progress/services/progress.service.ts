import { Injectable } from '@nestjs/common'
import { ResourceEntity } from 'src/shared/entities/resource.entity'
import { DataSource, Repository } from 'typeorm'
import * as xlsx from 'xlsx'
import { ApplicantProgressRepository } from '../repositories/applicantProgress.repository'

interface MilestoneRow {
  id: string
  name: string
  key: string
  description: string | null
  order: number
}

interface MilestoneIdRow {
  id: string
}

interface UserIdRow {
  id: string
}

@Injectable()
export class ProgressService {
  private readonly resourceRepo: Repository<ResourceEntity>

  constructor(
    private readonly progressRepo: ApplicantProgressRepository,
    private readonly dataSource: DataSource,
  ) {
    this.resourceRepo = dataSource.getRepository(ResourceEntity)
  }

  /**
   * Retorna el progreso completo de un aplicante para una convocatoria:
   * todos los hitos en orden con su estado (completado o no).
   */
  async getMyProgress(userId: number, announcementId: number) {
    const milestones = await this.dataSource.query<MilestoneRow[]>(
      `SELECT m.id, m.name, m.key, m.description, m.\`order\`
       FROM milestones m
       WHERE m.deletedAt IS NULL
       ORDER BY m.\`order\` ASC`,
    )

    const completed = await this.progressRepo.find({
      where: { userId, announcementId },
      select: ['milestoneId', 'completedAt'],
    })

    const completedMap = new Map(
      completed.map((p) => [Number(p.milestoneId), p.completedAt]),
    )

    return milestones.map((m) => ({
      id: Number(m.id),
      name: m.name,
      key: m.key,
      description: m.description,
      order: m.order,
      completado: completedMap.has(Number(m.id)),
      completedAt: completedMap.get(Number(m.id)) ?? null,
    }))
  }

  /**
   * Marca el hito al que pertenece un recurso como completado para el usuario.
   * Si el recurso no existe o no pertenece a la convocatoria, no hace nada.
   */
  async markMilestoneByResource(
    userId: number,
    resourceId: number,
    announcementId: number,
  ) {
    const resource = await this.resourceRepo.findOne({
      where: { id: resourceId, announcementId },
    })

    if (!resource) return

    await this.markMilestone(userId, announcementId, resource.milestoneId)
  }

  /**
   * Marca directamente un hito como completado para un usuario.
   * Usa INSERT IGNORE para ser idempotente (no falla si ya existe).
   */
  async markMilestone(
    userId: number,
    announcementId: number,
    milestoneId: number,
  ) {
    await this.dataSource.query(
      `INSERT IGNORE INTO applicant_progress (userId, announcementId, milestoneId, completedAt)
       VALUES (?, ?, ?, NOW())`,
      [userId, announcementId, milestoneId],
    )
  }

  /**
   * Marca un hito por su key para un usuario.
   * Útil para marcar hitos desde otros módulos (reapplication, bulk upload).
   */
  async markMilestoneByKey(
    userId: number,
    announcementId: number,
    milestoneKey: string,
  ) {
    const [milestone] = await this.dataSource.query<MilestoneIdRow[]>(
      `SELECT id FROM milestones WHERE \`key\` = ? AND deletedAt IS NULL LIMIT 1`,
      [milestoneKey],
    )

    if (!milestone) return

    await this.markMilestone(userId, announcementId, Number(milestone.id))
  }

  /**
   * Procesa un Excel con correos de quienes presentaron el examen.
   * Marca el hito "application" para cada usuario encontrado.
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
   * Marca el hito "certificate_upload" para cada usuario encontrado.
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

    const found = await this.dataSource.query<UserIdRow[]>(
      `SELECT id FROM users WHERE email IN (${emails.map(() => '?').join(',')}) AND deletedAt IS NULL`,
      emails,
    )

    const userIds = found.map((u) => Number(u.id))
    await this.markMilestoneByKeyBulk(userIds, announcementId, milestoneKey)

    return {
      procesados: userIds.length,
      noEncontrados: emails.length - userIds.length,
    }
  }

  /**
   * Marca un hito por su key para múltiples usuarios a la vez (usado en bulk upload).
   */
  async markMilestoneByKeyBulk(
    userIds: number[],
    announcementId: number,
    milestoneKey: string,
  ) {
    if (userIds.length === 0) return

    const [milestone] = await this.dataSource.query<MilestoneIdRow[]>(
      `SELECT id FROM milestones WHERE \`key\` = ? AND deletedAt IS NULL LIMIT 1`,
      [milestoneKey],
    )

    if (!milestone) return

    const milestoneId = Number(milestone.id)

    const values = userIds
      .map((uid) => `(${uid}, ${announcementId}, ${milestoneId}, NOW())`)
      .join(', ')

    await this.dataSource.query(
      `INSERT IGNORE INTO applicant_progress (userId, announcementId, milestoneId, completedAt)
       VALUES ${values}`,
    )
  }
}

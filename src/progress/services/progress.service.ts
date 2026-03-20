import { Injectable } from '@nestjs/common'
import { ResourceEntity } from 'src/shared/entities/resource.entity'
import { DataSource, Repository } from 'typeorm'
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

import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateResourceDto, UpdateResourceDto } from '../dtos/resource.dto'
import { AnnouncementRepository } from '../repositories/announcement.repository'
import { MilestoneRepository } from '../repositories/milestone.repository'
import { ResourceRepository } from '../repositories/resource.repository'

@Injectable()
export class ResourceService {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly announcementRepository: AnnouncementRepository,
    private readonly milestoneRepository: MilestoneRepository,
  ) {}

  async findByAnnouncement(announcementId: number) {
    return await this.resourceRepository.find({
      where: { announcementId },
      relations: ['milestone'],
      order: { milestoneId: 'ASC', createdAt: 'ASC' },
    })
  }

  async findByAnnouncementAndMilestone(
    announcementId: number,
    milestoneId: number,
  ) {
    return await this.resourceRepository.find({
      where: { announcementId, milestoneId },
      order: { createdAt: 'ASC' },
    })
  }

  async create(dto: CreateResourceDto) {
    const announcement = await this.announcementRepository.findOneBy({
      id: dto.announcementId,
    })
    if (!announcement) {
      throw new NotFoundException('Convocatoria no encontrada')
    }

    const milestone = await this.milestoneRepository.findOneBy({
      id: dto.milestoneId,
    })
    if (!milestone) {
      throw new NotFoundException('Hito no encontrado')
    }

    const resource = this.resourceRepository.create(dto)
    const saved = await this.resourceRepository.save(resource)
    return saved.id
  }

  async update(id: number, dto: UpdateResourceDto) {
    const resource = await this.findOrFail(id)

    if (dto.announcementId && dto.announcementId !== resource.announcementId) {
      const announcement = await this.announcementRepository.findOneBy({
        id: dto.announcementId,
      })
      if (!announcement)
        throw new NotFoundException('Convocatoria no encontrada')
    }

    if (dto.milestoneId && dto.milestoneId !== resource.milestoneId) {
      const milestone = await this.milestoneRepository.findOneBy({
        id: dto.milestoneId,
      })
      if (!milestone) throw new NotFoundException('Hito no encontrado')
    }

    await this.resourceRepository.update(id, dto)
  }

  async delete(id: number) {
    await this.findOrFail(id)
    await this.resourceRepository.softDelete(id)
  }

  private async findOrFail(id: number) {
    const resource = await this.resourceRepository.findOneBy({ id })
    if (!resource) throw new NotFoundException('Recurso no encontrado')
    return resource
  }
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { AnnouncementRepository } from '../repositories/announcement.repository'
import { MilestoneRepository } from '../repositories/milestone.repository'

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly milestoneRepository: MilestoneRepository,
  ) {}

  async findAll() {
    return await this.announcementRepository.find({
      where: { isActive: true },
      order: { examStartDate: 'ASC' },
    })
  }

  getMilestones() {
    return this.milestoneRepository.find({ order: { order: 'ASC' } })
  }

  async findById(id: number) {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
    })

    if (!announcement) {
      throw new NotFoundException('Convocatoria no encontrada')
    }

    return announcement
  }
}

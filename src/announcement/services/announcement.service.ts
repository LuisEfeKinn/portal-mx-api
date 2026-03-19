import { Injectable, NotFoundException } from '@nestjs/common'
import { AnnouncementRepository } from '../repositories/announcement.repository'

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
  ) {}

  async findAll() {
    return await this.announcementRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    })
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

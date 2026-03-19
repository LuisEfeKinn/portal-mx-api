import { Injectable } from '@nestjs/common'
import { AnnouncementService } from '../services/announcement.service'

@Injectable()
export class AnnouncementUseCase {
  constructor(private readonly announcementService: AnnouncementService) {}

  async findAll() {
    return await this.announcementService.findAll()
  }

  getMilestones() {
    return this.announcementService.getMilestones()
  }

  async findById(id: number) {
    return await this.announcementService.findById(id)
  }
}

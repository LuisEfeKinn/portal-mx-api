import { Injectable } from '@nestjs/common'
import { AnnouncementService } from '../services/announcement.service'

@Injectable()
export class AnnouncementUseCase {
  constructor(private readonly announcementService: AnnouncementService) {}

  async findAll() {
    return await this.announcementService.findAll()
  }

  async findById(id: number) {
    return await this.announcementService.findById(id)
  }
}

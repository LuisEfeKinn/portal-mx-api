import { Injectable } from '@nestjs/common'
import { CreateResourceDto, UpdateResourceDto } from '../dtos/resource.dto'
import { ResourceService } from '../services/resource.service'

@Injectable()
export class ResourceUseCase {
  constructor(private readonly resourceService: ResourceService) {}

  async findByAnnouncement(announcementId: number) {
    return await this.resourceService.findByAnnouncement(announcementId)
  }

  async findByAnnouncementAndMilestone(
    announcementId: number,
    milestoneId: number,
  ) {
    return await this.resourceService.findByAnnouncementAndMilestone(
      announcementId,
      milestoneId,
    )
  }

  async create(dto: CreateResourceDto) {
    return await this.resourceService.create(dto)
  }

  async update(id: number, dto: UpdateResourceDto) {
    return await this.resourceService.update(id, dto)
  }

  async delete(id: number) {
    return await this.resourceService.delete(id)
  }
}

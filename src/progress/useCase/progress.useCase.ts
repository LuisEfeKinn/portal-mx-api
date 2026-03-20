import { Injectable } from '@nestjs/common'
import { ResourceAccessedDto } from '../dtos/progress.dto'
import { ProgressService } from '../services/progress.service'

@Injectable()
export class ProgressUseCase {
  constructor(private readonly service: ProgressService) {}

  getMyProgress(userId: number, announcementId: number) {
    return this.service.getMyProgress(userId, announcementId)
  }

  markMilestoneByResource(userId: number, dto: ResourceAccessedDto) {
    return this.service.markMilestoneByResource(
      userId,
      dto.resourceId,
      dto.announcementId,
    )
  }
}

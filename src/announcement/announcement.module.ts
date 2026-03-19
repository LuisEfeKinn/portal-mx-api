import { Module } from '@nestjs/common'
import { SharedModule } from 'src/shared/shared.module'
import { AnnouncementController } from './controllers/announcement.controller'
import { ResourceController } from './controllers/resource.controller'
import { AnnouncementRepository } from './repositories/announcement.repository'
import { MilestoneRepository } from './repositories/milestone.repository'
import { ResourceRepository } from './repositories/resource.repository'
import { AnnouncementService } from './services/announcement.service'
import { ResourceService } from './services/resource.service'
import { AnnouncementUseCase } from './useCase/announcement.useCase'
import { ResourceUseCase } from './useCase/resource.useCase'

@Module({
  imports: [SharedModule.forRoot()],
  controllers: [AnnouncementController, ResourceController],
  providers: [
    AnnouncementRepository,
    MilestoneRepository,
    ResourceRepository,
    AnnouncementService,
    ResourceService,
    AnnouncementUseCase,
    ResourceUseCase,
  ],
})
export class AnnouncementModule {}

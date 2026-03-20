import { Module } from '@nestjs/common'
import { SharedModule } from 'src/shared/shared.module'
import { ProgressController } from './controllers/progress.controller'
import { ApplicantProgressRepository } from './repositories/applicantProgress.repository'
import { ProgressService } from './services/progress.service'
import { ProgressUseCase } from './useCase/progress.useCase'

@Module({
  imports: [SharedModule],
  controllers: [ProgressController],
  providers: [ApplicantProgressRepository, ProgressService, ProgressUseCase],
  exports: [ProgressService],
})
export class ProgressModule {}

import { Module } from '@nestjs/common'
import { S3Service } from 'src/shared/services/s3.service'
import { UploadFileService } from 'src/shared/services/uploadFile.service'
import { SharedModule } from 'src/shared/shared.module'
import { ReapplicationController } from './controllers/reapplication.controller'
import { ReapplicationRepository } from './repositories/reapplication.repository'
import { ReapplicationService } from './services/reapplication.service'
import { ReapplicationUseCase } from './useCase/reapplication.useCase'

@Module({
  imports: [SharedModule.forRoot()],
  controllers: [ReapplicationController],
  providers: [
    ReapplicationRepository,
    ReapplicationService,
    ReapplicationUseCase,
    S3Service,
    UploadFileService,
  ],
})
export class ReapplicationModule {}

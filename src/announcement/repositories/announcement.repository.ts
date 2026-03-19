import { Injectable } from '@nestjs/common'
import { AnnouncementEntity } from 'src/shared/entities/announcement.entity'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class AnnouncementRepository extends Repository<AnnouncementEntity> {
  constructor(dataSource: DataSource) {
    super(AnnouncementEntity, dataSource.createEntityManager())
  }
}

import { Injectable } from '@nestjs/common'
import { MilestoneEntity } from 'src/shared/entities/milestone.entity'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class MilestoneRepository extends Repository<MilestoneEntity> {
  constructor(dataSource: DataSource) {
    super(MilestoneEntity, dataSource.createEntityManager())
  }
}

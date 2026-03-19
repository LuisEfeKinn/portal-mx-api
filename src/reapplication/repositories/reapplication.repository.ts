import { Injectable } from '@nestjs/common'
import { ReapplicationRequestEntity } from 'src/shared/entities/reapplicationRequest.entity'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class ReapplicationRepository extends Repository<ReapplicationRequestEntity> {
  constructor(dataSource: DataSource) {
    super(ReapplicationRequestEntity, dataSource.createEntityManager())
  }
}

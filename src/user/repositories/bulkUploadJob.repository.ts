import { Injectable } from '@nestjs/common'
import { BulkUploadJobEntity } from 'src/shared/entities/bulkUploadJob.entity'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class BulkUploadJobRepository extends Repository<BulkUploadJobEntity> {
  constructor(dataSource: DataSource) {
    super(BulkUploadJobEntity, dataSource.createEntityManager())
  }
}

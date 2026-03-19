import { Injectable } from '@nestjs/common'
import { ResourceEntity } from 'src/shared/entities/resource.entity'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class ResourceRepository extends Repository<ResourceEntity> {
  constructor(dataSource: DataSource) {
    super(ResourceEntity, dataSource.createEntityManager())
  }
}

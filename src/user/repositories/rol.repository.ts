import { Injectable } from '@nestjs/common'
import { RolEntity } from 'src/shared/entities/rol.entity'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class RolRepository extends Repository<RolEntity> {
  constructor(dataSource: DataSource) {
    super(RolEntity, dataSource.createEntityManager())
  }
}

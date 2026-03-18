import { Injectable } from '@nestjs/common'
import { RolItemPermissionEntity } from 'src/shared/entities/rolItemPermission.entity'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class RolItemPermissionRepository extends Repository<RolItemPermissionEntity> {
  constructor(dataSource: DataSource) {
    super(RolItemPermissionEntity, dataSource.createEntityManager())
  }
}

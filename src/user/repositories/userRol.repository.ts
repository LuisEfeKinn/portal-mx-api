import { Injectable } from '@nestjs/common'
import { UserRoleEntity } from 'src/shared/entities/userRole.entity'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class UserRoleRepository extends Repository<UserRoleEntity> {
  constructor(dataSource: DataSource) {
    super(UserRoleEntity, dataSource.createEntityManager())
  }
}

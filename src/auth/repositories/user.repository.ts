import { Injectable } from '@nestjs/common'
import { UsersEntity } from 'src/shared/entities/users.entity'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class UserRepository extends Repository<UsersEntity> {
  constructor(dataSource: DataSource) {
    super(UsersEntity, dataSource.createEntityManager())
  }
}

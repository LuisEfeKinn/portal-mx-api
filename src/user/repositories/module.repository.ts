import { Injectable } from '@nestjs/common'
import { ModuleEntity } from 'src/shared/entities/module.entity'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class ModuleRepository extends Repository<ModuleEntity> {
  constructor(datasource: DataSource) {
    super(ModuleEntity, datasource.createEntityManager())
  }
}

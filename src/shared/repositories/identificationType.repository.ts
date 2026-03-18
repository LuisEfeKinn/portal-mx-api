import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { IdentificationTypesEntity } from '../entities/identificationTypes.entity'

@Injectable()
export class IdentificationTypeRepository extends Repository<IdentificationTypesEntity> {
  constructor(dataSource: DataSource) {
    super(IdentificationTypesEntity, dataSource.createEntityManager())
  }
}

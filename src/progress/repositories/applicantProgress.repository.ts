import { Injectable } from '@nestjs/common'
import { ApplicantProgressEntity } from 'src/shared/entities/applicantProgress.entity'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class ApplicantProgressRepository extends Repository<ApplicantProgressEntity> {
  constructor(dataSource: DataSource) {
    super(ApplicantProgressEntity, dataSource.createEntityManager())
  }
}

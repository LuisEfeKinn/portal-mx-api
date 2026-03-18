import { Injectable } from '@nestjs/common'

import { DataSource, Repository } from 'typeorm'

import { BlackListToken } from '../entities/blackListToken.entity'

@Injectable()
export class BlackListTokenRepository extends Repository<BlackListToken> {
  constructor(dataSource: DataSource) {
    super(BlackListToken, dataSource.createEntityManager())
  }
}

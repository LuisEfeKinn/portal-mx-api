import { Injectable } from '@nestjs/common'
import { ItemEntity } from 'src/shared/entities/item.entity'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class ItemRepository extends Repository<ItemEntity> {
  constructor(dataSource: DataSource) {
    super(ItemEntity, dataSource.createEntityManager())
  }
}

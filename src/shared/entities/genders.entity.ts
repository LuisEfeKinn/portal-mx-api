import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UsersEntity } from './users.entity'

@Entity('genders')
export class GendersEntity {
  @PrimaryColumn({ type: 'bigint' })
  id?: number

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt?: Date

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt?: Date

  @DeleteDateColumn({
    type: 'timestamp',
  })
  deletedAt?: Date

  @OneToMany(
    () => UsersEntity,
    (user) => user.genders,
  )
  users?: UsersEntity[]
}

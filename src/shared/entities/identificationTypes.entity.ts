import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UsersEntity } from './users.entity'

@Entity('identification_types')
export class IdentificationTypesEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  abbreviation: string

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
    (users) => users.identificationType,
  )
  users?: UsersEntity[]
}

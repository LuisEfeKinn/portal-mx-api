import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ResourceEntity } from './resource.entity'

@Entity('milestones')
export class MilestoneEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 50, unique: true })
  key: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'int' })
  order: number

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date

  @OneToMany(
    () => ResourceEntity,
    (resource) => resource.milestone,
  )
  resources: ResourceEntity[]
}

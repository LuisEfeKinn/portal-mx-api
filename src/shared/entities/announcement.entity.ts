import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ResourceEntity } from './resource.entity'

@Entity('announcements')
export class AnnouncementEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date

  @OneToMany(
    () => ResourceEntity,
    (resource) => resource.announcement,
  )
  resources: ResourceEntity[]
}

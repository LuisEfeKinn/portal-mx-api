import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { AnnouncementEntity } from './announcement.entity'
import { MilestoneEntity } from './milestone.entity'

@Entity('resources')
export class ResourceEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'varchar', length: 255 })
  title: string

  @Column({ type: 'varchar', length: 500 })
  url: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'bigint' })
  announcementId: number

  @Column({ type: 'bigint' })
  milestoneId: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date

  @ManyToOne(
    () => AnnouncementEntity,
    (announcement) => announcement.resources,
  )
  @JoinColumn({ name: 'announcementId' })
  announcement: AnnouncementEntity

  @ManyToOne(
    () => MilestoneEntity,
    (milestone) => milestone.resources,
  )
  @JoinColumn({ name: 'milestoneId' })
  milestone: MilestoneEntity
}

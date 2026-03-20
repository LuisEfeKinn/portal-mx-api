import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { AnnouncementEntity } from './announcement.entity'
import { MilestoneEntity } from './milestone.entity'
import { UsersEntity } from './users.entity'

@Entity('applicant_progress')
@Unique(['userId', 'announcementId', 'milestoneId'])
@Index(['userId', 'announcementId'])
export class ApplicantProgressEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'bigint' })
  userId: number

  @Column({ type: 'bigint' })
  announcementId: number

  @Column({ type: 'bigint' })
  milestoneId: number

  @Column({ type: 'timestamp' })
  completedAt: Date

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'userId' })
  user: UsersEntity

  @ManyToOne(() => AnnouncementEntity)
  @JoinColumn({ name: 'announcementId' })
  announcement: AnnouncementEntity

  @ManyToOne(() => MilestoneEntity)
  @JoinColumn({ name: 'milestoneId' })
  milestone: MilestoneEntity
}

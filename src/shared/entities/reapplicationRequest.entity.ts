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
import { UsersEntity } from './users.entity'

@Entity('reapplication_requests')
export class ReapplicationRequestEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'bigint' })
  userId: number

  @Column({ type: 'bigint' })
  announcementId: number

  @Column({ type: 'varchar', length: 255 })
  incidencia: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  documentUrl?: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'userId' })
  user: UsersEntity

  @ManyToOne(() => AnnouncementEntity)
  @JoinColumn({ name: 'announcementId' })
  announcement: AnnouncementEntity
}

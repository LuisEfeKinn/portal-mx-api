import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export type BulkUploadJobStatus = 'pending' | 'processing' | 'done' | 'failed'

@Entity('bulk_upload_jobs')
export class BulkUploadJobEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: BulkUploadJobStatus

  @Column({ type: 'varchar', length: 255 })
  fileName: string

  @Column({ type: 'varchar', length: 1000 })
  fileUrl: string

  @Column({ type: 'int', default: 0 })
  total: number

  @Column({ type: 'int', default: 0 })
  insertados: number

  @Column({ type: 'int', default: 0 })
  omitidos: number

  @Column({ type: 'int', default: 0 })
  erroresCount: number

  @Column({ type: 'varchar', length: 1000, nullable: true })
  reportUrl?: string

  @Column({ type: 'text', nullable: true })
  errorMessage?: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date
}

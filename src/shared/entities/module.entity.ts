import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ItemEntity } from './item.entity'

@Entity('modules')
export class ModuleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'varchar', length: '60', nullable: false })
  name: string

  @Column({ type: 'varchar', length: '255', nullable: true })
  description: string

  @Column({ type: 'varchar', length: '255', nullable: true })
  icon: string

  @Column({ type: 'varchar', length: '255', nullable: true })
  route: string

  @Column({ type: 'int', nullable: false, default: 0 })
  order: number

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date

  @OneToMany(
    () => ItemEntity,
    (item) => item.module,
  )
  itemsModule: ItemEntity[]
}

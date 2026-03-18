import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ModuleEntity } from './module.entity'
import { RolItemPermissionEntity } from './rolItemPermission.entity'

@Entity('items')
export class ItemEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'varchar', length: '60', nullable: false })
  name: string

  @Column({ type: 'varchar', length: '255', nullable: true })
  icon: string

  @Column({ type: 'varchar', length: '255', nullable: true })
  route: string

  @Column({ type: 'bigint', nullable: false })
  moduleId: number

  @Column({ type: 'bigint', nullable: true })
  itemparentId: number

  @Column({ type: 'int', nullable: false, default: 0 })
  order: number

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date

  @OneToMany(
    () => RolItemPermissionEntity,
    (rolItemPermission) => rolItemPermission.item,
  )
  rolItemPermissions: RolItemPermissionEntity[]

  @ManyToOne(
    () => ModuleEntity,
    (module) => module.itemsModule,
  )
  @JoinColumn({ name: 'moduleId' })
  module: ModuleEntity
}

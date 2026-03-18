import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { RolItemPermissionEntity } from './rolItemPermission.entity'

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'varchar', length: '100', nullable: false })
  name: string

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date

  @OneToMany(
    () => RolItemPermissionEntity,
    (rolItemPermission) => rolItemPermission.permission,
  )
  rolItemPermissions: RolItemPermissionEntity[]
}

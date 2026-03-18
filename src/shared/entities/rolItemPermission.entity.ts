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
import { ItemEntity } from './item.entity'
import { PermissionEntity } from './permission.entity'
import { RolEntity } from './rol.entity'

@Entity('rol_item_permissions')
export class RolItemPermissionEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'bigint', nullable: false })
  roleId: number

  @Column({ type: 'bigint', nullable: false })
  itemId: number

  @Column({ type: 'bigint', nullable: false })
  permissionId: number

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date

  @ManyToOne(
    () => ItemEntity,
    (item) => item.rolItemPermissions,
  )
  @JoinColumn({ name: 'itemId' })
  item: ItemEntity

  @ManyToOne(
    () => RolEntity,
    (rol) => rol.rolItemPermissions,
  )
  @JoinColumn({ name: 'roleId' })
  rol: RolEntity

  @ManyToOne(
    () => PermissionEntity,
    (permission) => permission.rolItemPermissions,
  )
  @JoinColumn({ name: 'permissionId' })
  permission: PermissionEntity
}

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
import { UserRoleEntity } from './userRole.entity'

@Entity('roles')
export class RolEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'varchar', length: '50', nullable: false })
  name: string

  @Column({ type: 'varchar', length: '255', nullable: true })
  description: string

  @Column({ type: 'boolean', default: false })
  isSystem: boolean

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  key: string

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date

  @OneToMany(
    () => UserRoleEntity,
    (userRole) => userRole.rol,
  )
  userRoles: UserRoleEntity[]

  @OneToMany(
    () => RolItemPermissionEntity,
    (rolItemPermission) => rolItemPermission.rol,
  )
  rolItemPermissions: RolItemPermissionEntity[]
}

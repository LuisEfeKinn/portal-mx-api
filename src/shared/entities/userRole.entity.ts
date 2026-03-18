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
import { RolEntity } from './rol.entity'
import { UsersEntity } from './users.entity'

@Entity('user_roles')
export class UserRoleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'bigint', nullable: false })
  userId: number

  @Column({ type: 'bigint', nullable: false })
  roleId: number

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date

  @ManyToOne(
    () => UsersEntity,
    (user) => user.roles,
  )
  @JoinColumn({
    name: 'userId',
  })
  user: UsersEntity

  @ManyToOne(
    () => RolEntity,
    (rol) => rol.userRoles,
  )
  @JoinColumn({
    name: 'roleId',
  })
  rol: RolEntity
}

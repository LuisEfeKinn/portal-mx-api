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
import { GendersEntity } from './genders.entity'
import { IdentificationTypesEntity } from './identificationTypes.entity'
import { UserRoleEntity } from './userRole.entity'

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  secondName?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstLastname?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  secondLastname?: string

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  identification?: string

  @Column({ nullable: true, type: 'bigint' })
  identificationTypeId?: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  displayName?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar?: string

  @Column({ nullable: true, type: 'bigint' })
  genderId?: number

  @Column({ type: 'varchar', length: 50, nullable: true })
  mobile?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  homePhone?: string

  @Column({ type: 'date', nullable: true })
  birthDate?: Date

  @Column({ type: 'varchar', length: 255, nullable: true })
  rememberToken?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  keyChangePassword?: string

  @Column({ type: 'boolean', default: false })
  isPasswordReset?: boolean

  @Column({ type: 'boolean', default: false })
  acceptedTerms?: boolean

  @Column({ type: 'boolean', default: false, nullable: true })
  isProfileCompleted?: boolean

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date

  @ManyToOne(
    () => IdentificationTypesEntity,
    (identificationTypes) => identificationTypes.users,
  )
  @JoinColumn({ name: 'identificationTypeId' })
  identificationType?: IdentificationTypesEntity

  @OneToMany(
    () => UserRoleEntity,
    (userRole) => userRole.user,
  )
  roles?: UserRoleEntity[]

  @ManyToOne(
    () => GendersEntity,
    (genders) => genders.users,
  )
  @JoinColumn({ name: 'genderId' })
  genders?: GendersEntity
}

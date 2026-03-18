import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { NOT_FOUND_MESSAGE } from 'src/shared/constants/messages.constant'
import { UserRoleEntity } from 'src/shared/entities/userRole.entity'
import { UserRepository } from 'src/shared/repositories/user.repository'
import { hashPassword } from 'src/shared/utils/password.util'
import { CreateUserDto, UpdateUserProfileDto } from '../dtos/user.dto'
import { UserRoleRepository } from '../repositories/userRol.repository'

@Injectable()
export class CrudUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<number> {
    const { roleIds, ...userData } = dto

    if (userData.email) {
      userData.email = userData.email.toLowerCase().trim()
    }

    await this.validateUniqueFields(userData.email, userData.identification)

    if (userData.password) {
      userData.password = await hashPassword(userData.password)
    }

    const newUser = this.userRepository.create(userData)
    const savedUser = await this.userRepository.save(newUser)

    if (roleIds && roleIds.length > 0) {
      const userRoles = roleIds.map((roleId) => {
        const userRole = new UserRoleEntity()
        userRole.userId = savedUser.id!
        userRole.roleId = roleId
        return userRole
      })
      await this.userRoleRepository.save(userRoles)
    }

    return savedUser.id!
  }

  async update(id: number, dto: UpdateUserProfileDto) {
    const { roleIds, ...userUpdates } = dto
    const existingUser = await this.findOrFailById(id)

    if (userUpdates.email) {
      userUpdates.email = userUpdates.email.toLowerCase().trim()
    }

    if (
      (userUpdates.email && userUpdates.email !== existingUser.email) ||
      (userUpdates.identification &&
        userUpdates.identification !== existingUser.identification)
    ) {
      await this.validateUniqueFields(
        userUpdates.email,
        userUpdates.identification,
        id,
      )
    }

    if (Object.keys(userUpdates).length > 0) {
      await this.userRepository.update(id, userUpdates)
    }

    if (roleIds) {
      await this.userRoleRepository.delete({ userId: id })
      if (roleIds.length > 0) {
        const newUserRoles = roleIds.map((roleId) => {
          const userRole = new UserRoleEntity()
          userRole.userId = id
          userRole.roleId = roleId
          return userRole
        })
        await this.userRoleRepository.save(newUserRoles)
      }
    }

    return await this.findOrFailById(id)
  }

  async updatePassword(id: number, plainPassword: string): Promise<void> {
    const cleanPassword = plainPassword.trim()
    const hashedPassword = await hashPassword(cleanPassword)
    await this.userRepository.update(id, { password: hashedPassword })
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } })
  }

  async findOrFailById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.rol', 'identificationType', 'genders'],
    })

    if (!user) {
      throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND)
    }

    const roles = user.roles
      ? user.roles.map((ur) => ({
          id: ur.rol.id,
          name: ur.rol.name,
        }))
      : []

    return {
      ...user,
      rolesRelation: undefined,
      roles,
    }
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.softDelete(id)
    if (result.affected === 0) {
      throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND)
    }
  }

  private async validateUniqueFields(
    email?: string,
    identification?: string,
    excludeId?: number,
  ) {
    const query = this.userRepository.createQueryBuilder('user')

    if (email) query.where('user.email = :email', { email })

    if (identification) {
      email
        ? query.orWhere('user.identification = :identification', {
            identification,
          })
        : query.where('user.identification = :identification', {
            identification,
          })
    }

    if (excludeId) query.andWhere('user.id != :id', { id: excludeId })

    if (!email && !identification) return

    const found = await query.getOne()

    if (found) {
      if (email && found.email === email) {
        throw new HttpException('Correo ya registrado', HttpStatus.BAD_REQUEST)
      }
      if (identification && found.identification === identification) {
        throw new HttpException(
          'Identificación ya registrada',
          HttpStatus.BAD_REQUEST,
        )
      }
    }
  }
}

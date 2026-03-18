import { UsersEntity } from 'src/shared/entities/users.entity'
import { UserResponseDto } from '../dtos/user.dto'

export const toUserResponseDto = (entity: UsersEntity): UserResponseDto => {
  const fullName = [
    entity.firstName,
    entity.secondName,
    entity.firstLastname,
    entity.secondLastname,
  ]
    .filter(Boolean)
    .join(' ')

  const roles =
    entity.roles?.map((userRole) => userRole.rol?.name).filter(Boolean) || []

  return {
    id: entity.id,
    fullName: fullName || entity.displayName || 'Sin Nombre',
    email: entity.email,
    identification: entity.identification || 'N/A',
    roles: roles,
    mobile: entity.mobile,
    isActive: entity.isActive,
    createdAt: entity.createdAt,
  }
}

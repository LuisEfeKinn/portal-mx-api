import { Injectable } from '@nestjs/common'
import { Paginated, PaginateQueryRaw } from 'src/shared/dtos/paginated.dto'
import { UserRepository } from 'src/shared/repositories/user.repository'
import { PaginatedService } from 'src/shared/services/paginated.service'
import { getSortOrder } from 'src/shared/utils/sortPagination.util'
import { UserResponseDto, VALID_FIELDS_USERS_ORDER } from '../dtos/user.dto'
import { toUserResponseDto } from '../mapper/user.mapper'

@Injectable()
export class GetAllUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly paginatedService: PaginatedService,
  ) {}

  async getAllUsers(
    params: PaginateQueryRaw,
  ): Promise<Paginated<UserResponseDto>> {
    const usersQueryBuilder = this.userRepository.createQueryBuilder('users')

    usersQueryBuilder
      .leftJoinAndSelect('users.roles', 'userRoles')
      .leftJoinAndSelect('userRoles.rol', 'rol')
      .leftJoinAndSelect('users.identificationType', 'identificationType')

    if (params.search) {
      usersQueryBuilder.andWhere(
        '(users.firstName LIKE :search OR users.firstLastname LIKE :search OR users.email LIKE :search OR users.identification LIKE :search)',
        { search: `%${params.search}%` },
      )
    }

    if (params.sort) {
      getSortOrder(usersQueryBuilder, params.sort, VALID_FIELDS_USERS_ORDER)
    }

    const rawPaginated = await this.paginatedService.paginateRows(
      usersQueryBuilder,
      params,
    )

    const mappedData = rawPaginated.rows.map((user) => toUserResponseDto(user))

    return {
      ...rawPaginated,
      rows: mappedData,
    }
  }
}

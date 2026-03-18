import { Injectable } from '@nestjs/common'
import { Paginated, PaginateQueryRaw } from 'src/shared/dtos/paginated.dto'
import { RolEntity } from 'src/shared/entities/rol.entity'
import { PaginatedService } from 'src/shared/services/paginated.service'
import { getSortOrder } from 'src/shared/utils/sortPagination.util'
import { VALID_FIELDS_ROLES_ORDER } from '../dtos/roles.dto'
import { RolRepository } from '../repositories/rol.repository'

@Injectable()
export class GetAllRolesService {
  constructor(
    private readonly rolRepository: RolRepository,
    private readonly paginatedService: PaginatedService,
  ) {}

  async getAllRoles(params: PaginateQueryRaw): Promise<Paginated<RolEntity>> {
    const rolesQueryBuilder = this.rolRepository.createQueryBuilder('roles')

    if (params.search) {
      rolesQueryBuilder.andWhere(
        '(roles.name LIKE :search OR roles.description LIKE :search)',
        { search: `%${params.search}%` },
      )
    }

    if (params.sort) {
      getSortOrder(rolesQueryBuilder, params.sort, VALID_FIELDS_ROLES_ORDER)
    }

    return await this.paginatedService.paginateRows(rolesQueryBuilder, params)
  }
}

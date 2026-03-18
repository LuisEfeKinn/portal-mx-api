import { Injectable } from '@nestjs/common'
import { PaginateQueryRaw } from 'src/shared/dtos/paginated.dto'
import { GetAllRolesService } from '../services/getAllRoles.service'

@Injectable()
export class GetAllRolesUseCase {
  constructor(private readonly getAllRolesService: GetAllRolesService) {}

  async getAllRoles(params: PaginateQueryRaw) {
    return await this.getAllRolesService.getAllRoles(params)
  }
}

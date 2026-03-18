import { Injectable } from '@nestjs/common'
import { AssignPermissionsDto } from '../dtos/assignPermissions.dto'
import { RoleDetailResponseDto } from '../dtos/roleResponse.dto'
import { CreateOrUpdateRolesDto } from '../dtos/roles.dto'
import { CrudRolesService } from '../services/crudRoles.service'

@Injectable()
export class RoleUseCase {
  constructor(private readonly crudRolesService: CrudRolesService) {}

  async create(dto: CreateOrUpdateRolesDto) {
    return await this.crudRolesService.createRole(dto)
  }

  async update(id: number, dto: CreateOrUpdateRolesDto) {
    return await this.crudRolesService.updateRole(id, dto)
  }

  async run(dto: AssignPermissionsDto) {
    return await this.crudRolesService.assignPermissions(dto)
  }

  async delete(id: number) {
    return await this.crudRolesService.deleteRole(id)
  }

  async getById(id: number): Promise<RoleDetailResponseDto> {
    return await this.crudRolesService.getRoleById(id)
  }
}

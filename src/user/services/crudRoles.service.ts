import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { RolItemPermissionEntity } from 'src/shared/entities/rolItemPermission.entity'
import { Not } from 'typeorm'
import { AssignPermissionsDto } from '../dtos/assignPermissions.dto'
import {
  ItemResponseDto,
  ModuleResponseDto,
  PermissionResponseDto,
  RoleDetailResponseDto,
} from '../dtos/roleResponse.dto'
import { CreateOrUpdateRolesDto } from '../dtos/roles.dto'
import { ItemRepository } from '../repositories/item.repository'
import { ModuleRepository } from '../repositories/module.repository'
import { RolRepository } from '../repositories/rol.repository'
import { RolItemPermissionRepository } from '../repositories/rolItemPermission.repository'

@Injectable()
export class CrudRolesService {
  constructor(
    private readonly rolRepository: RolRepository,
    private readonly itemRepository: ItemRepository,
    private readonly rolItemPermissionRepository: RolItemPermissionRepository,
    private readonly moduleRepository: ModuleRepository,
  ) {}

  async assignPermissions(dto: AssignPermissionsDto) {
    const role = await this.rolRepository.findOneBy({ id: dto.roleId })
    if (!role) throw new NotFoundException('El Rol no existe')
    const item = await this.itemRepository.findOneBy({ id: dto.itemId })
    if (!item) throw new NotFoundException('El Item no existe')

    await this.rolItemPermissionRepository.delete({
      roleId: dto.roleId,
      itemId: dto.itemId,
    })

    if (!dto.permissionIds || dto.permissionIds.length === 0) {
      return {
        message: 'Permisos eliminados/limpiados correctamente',
        role: role.name,
        item: item.name,
      }
    }

    const newPermissions = dto.permissionIds.map((permId) => {
      const entity = new RolItemPermissionEntity()
      entity.roleId = dto.roleId
      entity.itemId = dto.itemId
      entity.permissionId = permId
      return entity
    })

    await this.rolItemPermissionRepository.save(newPermissions)

    return {
      message: 'Permisos asignados correctamente',
      role: role.name,
      item: item.name,
      permissionsCount: newPermissions.length,
    }
  }

  async createRole(dto: CreateOrUpdateRolesDto) {
    const exists = await this.rolRepository.findOneBy({ name: dto.name })
    if (exists) {
      throw new BadRequestException('Ya existe un rol con ese nombre')
    }

    const newRole = this.rolRepository.create(dto)
    return await this.rolRepository.save(newRole)
  }

  async updateRole(id: number, dto: CreateOrUpdateRolesDto) {
    const role = await this.rolRepository.findOneBy({ id })
    if (!role) {
      throw new NotFoundException('El rol no existe')
    }

    if (role.isSystem) {
      throw new ForbiddenException('No se puede modificar un rol del sistema')
    }

    if (dto.name !== role.name) {
      const exists = await this.rolRepository.findOne({
        where: { name: dto.name, id: Not(id) },
      })
      if (exists) {
        throw new BadRequestException('Ya existe otro rol con ese nombre')
      }
    }

    this.rolRepository.merge(role, dto)
    return await this.rolRepository.save(role)
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.rolRepository.findOneBy({ id })
    if (!role) {
      throw new NotFoundException('El rol no existe')
    }

    if (role.isSystem) {
      throw new ForbiddenException('No se puede eliminar un rol del sistema')
    }

    await this.rolRepository.softDelete(id)
  }

  async getRoleById(id: number): Promise<RoleDetailResponseDto> {
    const role = await this.rolRepository.findOne({
      where: { id },
      relations: [
        'rolItemPermissions',
        'rolItemPermissions.item',
        'rolItemPermissions.permission',
      ],
    })

    if (!role) {
      throw new NotFoundException('El rol no existe')
    }

    const allModules = await this.moduleRepository.find({
      relations: ['itemsModule'],
      order: {
        order: 'ASC',
        itemsModule: {
          order: 'ASC',
        },
      },
    })

    const permissionsMap = new Map<number, PermissionResponseDto[]>()

    if (role.rolItemPermissions) {
      role.rolItemPermissions.forEach((rip) => {
        if (!rip.item || !rip.permission) return

        const itemId = rip.itemId

        if (!permissionsMap.has(itemId)) {
          permissionsMap.set(itemId, [])
        }
        permissionsMap.get(itemId)!.push({
          id: rip.permission.id,
          name: rip.permission.name,
        })
      })
    }

    const modulesResponse: ModuleResponseDto[] = allModules.map((module) => {
      const itemsResponse: ItemResponseDto[] = module.itemsModule.map(
        (item) => {
          const assignedPermissions = permissionsMap.get(item.id) || []

          return {
            id: item.id,
            name: item.name,
            icon: item.icon,
            route: item.route,
            permissions: assignedPermissions,
          }
        },
      )

      return {
        id: module.id,
        name: module.name,
        icon: module.icon,
        items: itemsResponse,
      }
    })

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      modules: modulesResponse,
    }
  }
}

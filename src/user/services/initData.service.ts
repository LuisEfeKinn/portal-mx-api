import { Injectable, NotFoundException } from '@nestjs/common'
import { ItemEntity } from 'src/shared/entities/item.entity'
import { UserRepository } from 'src/shared/repositories/user.repository'
import {
  InitDataResponseDto,
  MenuItemDto,
  ModuleDto,
  RoleContextDto,
} from '../dtos/initData.dto'
import { RolItemPermissionRepository } from '../repositories/rolItemPermission.repository'

interface ItemProcessingContext {
  itemEntity: ItemEntity
  permissionNames: Set<string>
}

@Injectable()
export class InitDataService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rolItemPermissionRepository: RolItemPermissionRepository,
  ) {}

  async getInitData(userId: number): Promise<InitDataResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.rol'],
    })

    if (!user) throw new NotFoundException('Usuario no encontrado')

    const rolesContext: RoleContextDto[] = []

    for (const userRole of user.roles) {
      const role = userRole.rol
      const roleModules = await this.buildMenuForRole(role.id)

      rolesContext.push({
        id: role.id,
        name: role.name,
        description: role.description,
        modules: roleModules,
      })
    }

    return {
      id: user.id,
      names: `${user.firstName || ''} ${user.firstLastname || ''}`.trim(),
      email: user.email,
      roles: rolesContext,
    }
  }

  private async buildMenuForRole(roleId: number): Promise<ModuleDto[]> {
    const permissions = await this.rolItemPermissionRepository.find({
      where: { roleId: Number(roleId) },
      relations: ['item', 'item.module', 'permission'],
      order: {
        item: {
          order: 'ASC',
          module: { order: 'ASC' },
        },
      },
    })

    if (!permissions.length) return []

    const itemsMap = new Map<number, ItemProcessingContext>()

    permissions.forEach((p) => {
      if (!p.item || !p.item.module) return

      const itemId = Number(p.item.id)

      if (!itemsMap.has(itemId)) {
        itemsMap.set(itemId, {
          itemEntity: p.item,
          permissionNames: new Set<string>(),
        })
      }

      const itemContext = itemsMap.get(itemId)
      if (itemContext) {
        itemContext.permissionNames.add(p.permission.name)
      }
    })

    const modulesMap = new Map<number, ModuleDto>()
    const allProcessedItems: MenuItemDto[] = []

    for (const [, data] of itemsMap.entries()) {
      const { itemEntity, permissionNames } = data
      const permArray = Array.from(permissionNames)

      const moduleId = Number(itemEntity.module.id)

      const menuItem: MenuItemDto = {
        id: Number(itemEntity.id),
        name: itemEntity.name,
        icon: itemEntity.icon,
        path: itemEntity.route,
        order: itemEntity.order,
        itemparentId: itemEntity.itemparentId
          ? Number(itemEntity.itemparentId)
          : null,
        permissions: permArray,
        children: [],
      }

      allProcessedItems.push(menuItem)

      if (!modulesMap.has(moduleId)) {
        modulesMap.set(moduleId, {
          moduleId: moduleId,
          subheader: itemEntity.module.name,
          icon: itemEntity.module.icon,
          order: itemEntity.module.order,
          items: [],
        })
      }
    }

    const itemsLookup = new Map<number, MenuItemDto>()
    allProcessedItems.forEach((it) => itemsLookup.set(it.id, it))

    const rootItemsForModule: MenuItemDto[] = []

    allProcessedItems.forEach((item) => {
      if (item.itemparentId && itemsLookup.has(item.itemparentId)) {
        const parent = itemsLookup.get(item.itemparentId)
        if (parent) parent.children.push(item)
      } else {
        rootItemsForModule.push(item)
      }
    })

    allProcessedItems.forEach((it) => {
      if (it.children.length > 0) {
        it.children.sort((a, b) => a.order - b.order)
      }
    })

    rootItemsForModule.forEach((item) => {
      const originalData = itemsMap.get(item.id)

      if (originalData) {
        const moduleId = Number(originalData.itemEntity.module.id)

        const moduleDto = modulesMap.get(moduleId)
        if (moduleDto) {
          moduleDto.items.push(item)
        }
      }
    })

    return Array.from(modulesMap.values())
      .sort((a, b) => a.order - b.order)
      .map((mod) => {
        mod.items.sort((a, b) => a.order - b.order)
        return mod
      })
  }
}

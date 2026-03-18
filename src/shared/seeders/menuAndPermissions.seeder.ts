import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { PermissionRepository } from 'src/shared/repositories/permission.repository'
import { ItemRepository } from 'src/user/repositories/item.repository'
import { ModuleRepository } from 'src/user/repositories/module.repository'
import { RolRepository } from 'src/user/repositories/rol.repository'
import { RolItemPermissionRepository } from 'src/user/repositories/rolItemPermission.repository'

interface ModuleSeed {
  name: string
  description: string
  icon: string
  route: string
  order: number
}

interface ItemSeed {
  name: string
  icon: string
  route: string
  moduleName: string
  order: number
}

interface RolePermissionSeed {
  roleKey: string
  itemName: string
  permissions: string[]
}

@Injectable()
export class MenuAndPermissionsSeeder implements OnModuleInit {
  private readonly logger = new Logger(MenuAndPermissionsSeeder.name)

  private readonly modules: ModuleSeed[] = [
    {
      name: 'panel.title',
      description: 'Panel principal',
      icon: 'ic_dashboard',
      route: '/panel',
      order: 1,
    },
  ]

  private readonly items: ItemSeed[] = [
    {
      name: 'panel.items.dashboard',
      icon: 'ic_dashboard',
      route: '/panel/dashboard',
      moduleName: 'panel.title',
      order: 1,
    },
    {
      name: 'panel.items.users',
      icon: 'ic_users',
      route: '/panel/users',
      moduleName: 'panel.title',
      order: 2,
    },
  ]

  private readonly permissionNames = ['view', 'create', 'edit', 'delete']

  private readonly rolePermissions: RolePermissionSeed[] = [
    {
      roleKey: 'user',
      itemName: 'panel.items.dashboard',
      permissions: ['view'],
    },
  ]

  constructor(
    private readonly moduleRepository: ModuleRepository,
    private readonly itemRepository: ItemRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly rolRepository: RolRepository,
    private readonly rolItemPermissionRepository: RolItemPermissionRepository,
  ) {}

  async onModuleInit() {
    if (process.env.RUN_SEEDERS !== 'true') return
    await this.seed()
  }

  async seed() {
    this.logger.log('Seeding menu and permissions...')

    await this.seedModules()
    await this.seedItems()
    await this.seedPermissions()
    await this.seedAdminPermissions()
    await this.seedRolePermissions()

    this.logger.log('Menu and permissions seeding completed')
  }

  private async seedModules() {
    for (const mod of this.modules) {
      const existing = await this.moduleRepository.findOneBy({
        name: mod.name,
      })
      if (!existing) {
        await this.moduleRepository.save(this.moduleRepository.create(mod))
        this.logger.log(`Created module: ${mod.name}`)
      }
    }
  }

  private async seedItems() {
    for (const item of this.items) {
      const existing = await this.itemRepository.findOneBy({
        name: item.name,
      })
      if (!existing) {
        const module = await this.moduleRepository.findOneBy({
          name: item.moduleName,
        })
        if (!module) {
          this.logger.warn(
            `Module not found for item ${item.name}: ${item.moduleName}`,
          )
          continue
        }
        await this.itemRepository.save(
          this.itemRepository.create({
            name: item.name,
            icon: item.icon,
            route: item.route,
            moduleId: module.id,
            order: item.order,
          }),
        )
        this.logger.log(`Created item: ${item.name}`)
      }
    }
  }

  private async seedPermissions() {
    for (const name of this.permissionNames) {
      const existing = await this.permissionRepository.findOneBy({ name })
      if (!existing) {
        await this.permissionRepository.save(
          this.permissionRepository.create({ name }),
        )
        this.logger.log(`Created permission: ${name}`)
      }
    }
  }

  private async seedAdminPermissions() {
    const admin = await this.rolRepository.findOneBy({ key: 'admin' })
    if (!admin) return

    const allItems = await this.itemRepository.find()
    const allPermissions = await this.permissionRepository.find()

    for (const item of allItems) {
      for (const permission of allPermissions) {
        const existing = await this.rolItemPermissionRepository.findOneBy({
          roleId: admin.id,
          itemId: item.id,
          permissionId: permission.id,
        })
        if (!existing) {
          await this.rolItemPermissionRepository.save(
            this.rolItemPermissionRepository.create({
              roleId: admin.id,
              itemId: item.id,
              permissionId: permission.id,
            }),
          )
        }
      }
    }
    this.logger.log(
      `Admin permissions assigned (${allItems.length} items x ${allPermissions.length} permissions)`,
    )
  }

  private async seedRolePermissions() {
    for (const rp of this.rolePermissions) {
      const role = await this.rolRepository.findOneBy({ key: rp.roleKey })
      const item = await this.itemRepository.findOneBy({ name: rp.itemName })

      if (!role || !item) {
        this.logger.warn(
          `Skipping: role=${rp.roleKey} item=${rp.itemName} (not found)`,
        )
        continue
      }

      for (const permName of rp.permissions) {
        const permission = await this.permissionRepository.findOneBy({
          name: permName,
        })
        if (!permission) continue

        const existing = await this.rolItemPermissionRepository.findOneBy({
          roleId: role.id,
          itemId: item.id,
          permissionId: permission.id,
        })
        if (!existing) {
          await this.rolItemPermissionRepository.save(
            this.rolItemPermissionRepository.create({
              roleId: role.id,
              itemId: item.id,
              permissionId: permission.id,
            }),
          )
        }
      }
      this.logger.log(
        `Assigned ${rp.permissions.join(', ')} to ${rp.roleKey} on ${rp.itemName}`,
      )
    }
  }
}

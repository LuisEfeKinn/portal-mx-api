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
      name: 'dashboard.title',
      description: 'Dashboard principal',
      icon: 'ic_dashboard',
      route: '/dashboard',
      order: 1,
    },
    {
      name: 'users.title',
      description: 'Gestión de usuarios',
      icon: 'ic_users',
      route: '/users',
      order: 2,
    },
    {
      name: 'applications.title',
      description: 'Gestión de convocatorias',
      icon: 'ic_calendar',
      route: '/applications',
      order: 3,
    },
    {
      name: 'resources.title',
      description: 'Gestión de recursos por hito',
      icon: 'ic_folder',
      route: '/resources',
      order: 4,
    },
    {
      name: 'reapplications.title',
      description: 'Solicitudes de reaplicación',
      icon: 'ic_file',
      route: '/reapplications',
      order: 5,
    },
  ]

  private readonly items: ItemSeed[] = [
    // Dashboard
    {
      name: 'dashboard.items.home',
      icon: 'ic_dashboard',
      route: '/dashboard',
      moduleName: 'dashboard.title',
      order: 1,
    },
    // Usuarios
    {
      name: 'users.items.list',
      icon: 'ic_users',
      route: '/users',
      moduleName: 'users.title',
      order: 1,
    },
    // Aplicaciones (convocatorias)
    {
      name: 'applications.items.list',
      icon: 'ic_calendar',
      route: '/applications',
      moduleName: 'applications.title',
      order: 1,
    },
    // Recursos
    {
      name: 'resources.items.list',
      icon: 'ic_folder',
      route: '/resources',
      moduleName: 'resources.title',
      order: 1,
    },
    // Solicitudes de reaplicación
    {
      name: 'reapplications.items.list',
      icon: 'ic_file',
      route: '/reapplications',
      moduleName: 'reapplications.title',
      order: 1,
    },
  ]

  private readonly permissionNames = ['view', 'create', 'edit', 'delete']

  // Solo viewer — admin recibe todo en seedAdminPermissions
  private readonly rolePermissions: RolePermissionSeed[] = [
    {
      roleKey: 'viewer',
      itemName: 'reapplications.items.list',
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
    this.logger.log('Sembrando menú y permisos...')

    await this.seedModules()
    await this.seedItems()
    await this.seedPermissions()
    await this.seedAdminPermissions()
    await this.seedRolePermissions()

    this.logger.log('Menú y permisos completados')
  }

  private async seedModules() {
    for (const mod of this.modules) {
      const existing = await this.moduleRepository.findOneBy({ name: mod.name })
      if (!existing) {
        await this.moduleRepository.save(this.moduleRepository.create(mod))
        this.logger.log(`Módulo creado: ${mod.name}`)
      }
    }
  }

  private async seedItems() {
    for (const item of this.items) {
      const existing = await this.itemRepository.findOneBy({ name: item.name })
      if (!existing) {
        const module = await this.moduleRepository.findOneBy({
          name: item.moduleName,
        })
        if (!module) {
          this.logger.warn(
            `Módulo no encontrado para item ${item.name}: ${item.moduleName}`,
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
        this.logger.log(`Item creado: ${item.name}`)
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
        this.logger.log(`Permiso creado: ${name}`)
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
      `Permisos admin asignados (${allItems.length} items x ${allPermissions.length} permisos)`,
    )
  }

  private async seedRolePermissions() {
    for (const rp of this.rolePermissions) {
      const role = await this.rolRepository.findOneBy({ key: rp.roleKey })
      const item = await this.itemRepository.findOneBy({ name: rp.itemName })

      if (!role || !item) {
        this.logger.warn(
          `Omitido: role=${rp.roleKey} item=${rp.itemName} (no encontrado)`,
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
      this.logger.log(`Permisos asignados: ${rp.roleKey} → ${rp.itemName}`)
    }
  }
}

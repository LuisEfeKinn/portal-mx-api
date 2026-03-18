import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { RolRepository } from 'src/user/repositories/rol.repository'

interface SystemRole {
  name: string
  key: string
  description: string
}

@Injectable()
export class RolesSeeder implements OnModuleInit {
  private readonly logger = new Logger(RolesSeeder.name)

  private readonly systemRoles: SystemRole[] = [
    {
      name: 'Admin',
      key: 'admin',
      description: 'Administrador con acceso total al sistema',
    },
    {
      name: 'Usuario',
      key: 'user',
      description: 'Usuario estándar',
    },
  ]

  constructor(private readonly rolRepository: RolRepository) {}

  async onModuleInit() {
    if (process.env.RUN_SEEDERS !== 'true') return
    await this.seed()
  }

  async seed() {
    this.logger.log('Checking system roles...')

    for (const roleData of this.systemRoles) {
      const existingRole = await this.rolRepository.findOneBy({
        key: roleData.key,
      })

      if (!existingRole) {
        const newRole = this.rolRepository.create({
          name: roleData.name,
          key: roleData.key,
          description: roleData.description,
          isSystem: true,
        })
        await this.rolRepository.save(newRole)
        this.logger.log(
          `Created system role: ${roleData.name} (${roleData.key})`,
        )
      } else if (!existingRole.isSystem) {
        existingRole.isSystem = true
        await this.rolRepository.save(existingRole)
        this.logger.log(
          `Updated role to system: ${roleData.name} (${roleData.key})`,
        )
      }
    }

    this.logger.log('System roles check completed')
  }
}

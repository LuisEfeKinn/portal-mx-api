import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { UserRoleEntity } from 'src/shared/entities/userRole.entity'
import { UserRepository } from 'src/shared/repositories/user.repository'
import { hashPassword } from 'src/shared/utils/password.util'
import { RolRepository } from 'src/user/repositories/rol.repository'
import { UserRoleRepository } from 'src/user/repositories/userRol.repository'

interface TestUserSeed {
  email: string
  password: string
  firstName: string
  roleKey: string
}

@Injectable()
export class TestUsersSeeder implements OnModuleInit {
  private readonly logger = new Logger(TestUsersSeeder.name)

  private readonly users: TestUserSeed[] = [
    {
      email: 'viewer@portal.com',
      password: 'Viewer123*',
      firstName: 'Supervisor',
      roleKey: 'viewer',
    },
    {
      email: 'user@portal.com',
      password: 'User123*',
      firstName: 'Aplicante',
      roleKey: 'user',
    },
  ]

  constructor(
    private readonly userRepository: UserRepository,
    private readonly rolRepository: RolRepository,
    private readonly userRoleRepository: UserRoleRepository,
  ) {}

  async onModuleInit() {
    if (process.env.RUN_SEEDERS !== 'true') return
    await this.seed()
  }

  async seed() {
    this.logger.log('Verificando usuarios de prueba...')

    for (const data of this.users) {
      const existing = await this.userRepository.findOneBy({
        email: data.email,
      })
      if (existing) {
        this.logger.log(`Usuario ${data.email} ya existe, omitiendo`)
        continue
      }

      const role = await this.rolRepository.findOneBy({ key: data.roleKey })
      if (!role) {
        this.logger.warn(
          `Rol '${data.roleKey}' no encontrado — ejecuta primero el seeder de roles`,
        )
        continue
      }

      const hashed = await hashPassword(data.password)
      const user = await this.userRepository.save(
        this.userRepository.create({
          email: data.email,
          password: hashed,
          firstName: data.firstName,
          isActive: true,
          acceptedTerms: true,
        }),
      )

      const userRole = new UserRoleEntity()
      userRole.userId = user.id
      userRole.roleId = role.id
      await this.userRoleRepository.save(userRole)

      this.logger.log(
        `Usuario de prueba creado: ${data.email} / ${data.password} [${data.roleKey}]`,
      )
    }

    this.logger.log('Usuarios de prueba verificados')
  }
}

import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { UserRoleEntity } from 'src/shared/entities/userRole.entity'
import { BlackListTokenRepository } from 'src/shared/repositories/blackListToken.repository'
import { UserRepository } from 'src/shared/repositories/user.repository'
import { hashPassword } from 'src/shared/utils/password.util'
import { RolRepository } from 'src/user/repositories/rol.repository'
import { UserRoleRepository } from 'src/user/repositories/userRol.repository'

@Injectable()
export class AdminUserSeeder implements OnModuleInit {
  private readonly logger = new Logger(AdminUserSeeder.name)

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
    this.logger.log('Verificando usuario administrador...')

    const email = process.env.ADMIN_DEFAULT_EMAIL ?? 'admin@portal.com'
    const password = process.env.ADMIN_DEFAULT_PASSWORD ?? 'Admin123*'

    const existing = await this.userRepository.findOneBy({ email })
    if (existing) {
      this.logger.log('Usuario administrador ya existe, omitiendo')
      return
    }

    const adminRole = await this.rolRepository.findOneBy({ key: 'admin' })
    if (!adminRole) {
      this.logger.warn('Rol admin no encontrado — ejecuta primero el seeder de roles')
      return
    }

    const hashed = await hashPassword(password)
    const user = await this.userRepository.save(
      this.userRepository.create({
        email,
        password: hashed,
        firstName: 'Administrador',
        isActive: true,
        acceptedTerms: true,
      }),
    )

    const userRole = new UserRoleEntity()
    userRole.userId = user.id
    userRole.roleId = adminRole.id
    await this.userRoleRepository.save(userRole)

    this.logger.log(`Usuario admin creado: ${email} / ${password}`)
    this.logger.warn('Cambia la contraseña del admin después del primer inicio de sesión')
  }
}

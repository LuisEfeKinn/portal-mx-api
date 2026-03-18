import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ConfigModule } from '@nestjs/config/dist/config.module'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { DEFAULT_STRATEGY } from 'src/shared/constants/auth.constant'
import { UserRepository } from 'src/shared/repositories/user.repository'
import { PaginatedService } from 'src/shared/services/paginated.service'
import { SharedModule } from 'src/shared/shared.module'
import { RolesController } from './controllers/roles.controller'
import { UserController } from './controllers/user.controller'
import { ItemRepository } from './repositories/item.repository'
import { ModuleRepository } from './repositories/module.repository'
import { RolRepository } from './repositories/rol.repository'
import { RolItemPermissionRepository } from './repositories/rolItemPermission.repository'
import { UserRoleRepository } from './repositories/userRol.repository'
import { CrudRolesService } from './services/crudRoles.service'
import { CrudUserService } from './services/crudUser.service'
import { GetAllRolesService } from './services/getAllRoles.service'
import { GetAllUserService } from './services/getAllUser.service'
import { InitDataService } from './services/initData.service'
import { GetAllRolesUseCase } from './useCase/getAllRoles.useCase'
import { RoleUseCase } from './useCase/role.useCase'
import { CrudUsersUseCase } from './useCase/user.useCase'

@Module({
  imports: [
    SharedModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      // eslint-disable-next-line require-await
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({
      defaultStrategy: DEFAULT_STRATEGY,
    }),
  ],
  providers: [
    CrudUserService,
    InitDataService,
    UserRepository,
    CrudUsersUseCase,
    RolItemPermissionRepository,
    RolRepository,
    ItemRepository,
    CrudRolesService,
    RoleUseCase,
    GetAllRolesUseCase,
    GetAllRolesService,
    PaginatedService,
    ModuleRepository,
    UserRoleRepository,
    UserRepository,
    GetAllUserService,
  ],
  controllers: [UserController, RolesController],
  exports: [CrudUserService],
})
export class UserModule {}

import { HttpModule } from '@nestjs/axios'
import { DynamicModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { join } from 'path'
import { ItemRepository } from 'src/user/repositories/item.repository'
import { ModuleRepository } from 'src/user/repositories/module.repository'
import { RolRepository } from 'src/user/repositories/rol.repository'
import { RolItemPermissionRepository } from 'src/user/repositories/rolItemPermission.repository'
import { HealthController } from './controllers/health.controller'
import { UploadFileController } from './controllers/uploadFile.controller'
import { BlackListTokenRepository } from './repositories/blackListToken.repository'
import { IdentificationTypeRepository } from './repositories/identificationType.repository'
import { PermissionRepository } from './repositories/permission.repository'
import { UserRepository } from './repositories/user.repository'
import { MenuAndPermissionsSeeder } from './seeders/menuAndPermissions.seeder'
import { RolesSeeder } from './seeders/roles.seeder'
import { AuthService } from './services/auth.service'
import { PasswordService } from './services/password.service'
import { S3Service } from './services/s3.service'
import { UploadFileService } from './services/uploadFile.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UploadFileUseCase } from './useCase/uploadFile.useCase'

@Module({
  providers: [
    UploadFileService,
    S3Service,
    UploadFileUseCase,
  ],
  controllers: [
    UploadFileController,
    HealthController,
  ],
})
export class SharedModule {
  static forRoot(): DynamicModule {
    return {
      module: SharedModule,
      providers: [
        JwtStrategy,
        UserRepository,
        PasswordService,
        BlackListTokenRepository,
        AuthService,
        IdentificationTypeRepository,
        PermissionRepository,
        // Roles
        RolRepository,
        RolesSeeder,
        // Menu & Permissions
        ItemRepository,
        ModuleRepository,
        RolItemPermissionRepository,
        MenuAndPermissionsSeeder,
      ],
      exports: [
        PasswordService,
        BlackListTokenRepository,
        AuthService,
        UserRepository,
      ],
      imports: [
        HttpModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        MailerModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: {
              host: configService.get<string>('MAIL_HOST'),
              port: configService.get<number>('MAIL_PORT'),
              secure: configService.get<string>('MAIL_SECURE') === 'true',
              auth: {
                user: configService.get<string>('MAIL_USERNAME'),
                pass: configService.get<string>('MAIL_PASSWORD'),
              },
              defaults: {
                from: configService.get<string>('MAIL_SENDER'),
              },
            },
            template: {
              dir: join(__dirname, 'templates'),
              adapter: new HandlebarsAdapter(),
            },
          }),
        }),
      ],
    }
  }
}

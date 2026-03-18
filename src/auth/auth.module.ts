import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { SharedModule } from 'src/shared/shared.module'
import { BlackListTokenRepository } from 'src/shared/repositories/blackListToken.repository'
import { UserRepository } from 'src/shared/repositories/user.repository'
import { MailsService } from 'src/shared/services/mails.service'
import { PasswordService } from 'src/shared/services/password.service'
import { SendEmailsService } from 'src/shared/services/sendEmails.service'
import { JwtStrategy } from 'src/shared/strategies/jwt.strategy'
import { RolRepository } from 'src/user/repositories/rol.repository'
import { UserRoleRepository } from 'src/user/repositories/userRol.repository'
import { CrudUserService } from 'src/user/services/crudUser.service'
import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'
import { ForgotPasswordUseCase } from './useCase/forgotPasswordUseCase.UseCase'
import { RefreshTokenUseCase } from './useCase/refreshToken.useCase'
import { SignInUseCase } from './useCase/signIn.useCase'
import { SignOutUseCase } from './useCase/signOut.useCase'
import { SignUpUseCase } from './useCase/signUp.useCase'

@Module({
  imports: [
    SharedModule.forRoot(),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expiresIn') },
      }),
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    SignInUseCase,
    UserRepository,
    AuthService,
    SignOutUseCase,
    RefreshTokenUseCase,
    ForgotPasswordUseCase,
    MailsService,
    SendEmailsService,
    PasswordService,
    BlackListTokenRepository,
    CrudUserService,
    UserRoleRepository,
    SignUpUseCase,
    RolRepository,
  ],
})
export class AuthModule {}

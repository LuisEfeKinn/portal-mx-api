import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AnnouncementModule } from './announcement/announcement.module'
import { AuthModule } from './auth/auth.module'
import { config } from './config'
import { SharedModule } from './shared/shared.module'
import { UserModule } from './user/user.module'
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        synchronize: false,
        charset: 'utf8mb4_unicode_ci',
      }),
      inject: [ConfigService],
    }),
    SharedModule.forRoot(),
    AuthModule,
    UserModule,
    AnnouncementModule,
  ],
})
export class AppModule {}

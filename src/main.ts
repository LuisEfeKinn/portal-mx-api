import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as dayjs from 'dayjs'
import * as express from 'express'
import * as basicAuth from 'express-basic-auth'
import helmet from 'helmet'

import 'dayjs/locale/es'

import { AppModule } from './app.module'
import { LoggerFactory } from './shared/factories/logger.factory'
import { HttpExceptionFilter } from './shared/filters/httpException.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: false,
    logger: LoggerFactory(),
  })

  dayjs.locale('es')

  const configService = app.get(ConfigService)

  const appName = configService.get('app.name')
  const port = configService.get('app.port')

  // Swagger Config
  const swaggerUser = configService.get('swagger.user')
  const swaggerPassword = configService.get('swagger.password')

  const origin = configService.get('app.cors.origin')
  const allowedHeaders = configService.get('app.cors.allowedHeaders')
  const allowedMethods = configService.get('app.cors.allowedMethods')

  /* -------------------------------------------------------- */
  /* SWAGGER CON SEGURIDAD (BASIC AUTH)                       */
  /* -------------------------------------------------------- */
  if (swaggerUser && swaggerPassword) {
    app.use(
      ['/docs', '/docs-json'],
      basicAuth({
        challenge: true,
        users: {
          [swaggerUser]: swaggerPassword,
        },
      }),
    )
  }

  const config = new DocumentBuilder()
    .setTitle(appName || 'portal-mx-api')
    .setDescription('Documentación del API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
    },
  })

  /* -------------------------------------------------------- */
  /* GLOBAL PIPES (VALIDACIÓN)                                */
  /* -------------------------------------------------------- */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      /* false para que no lance error si el front envía campos extra */
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  /* -------------------------------------------------------- */
  /* GLOBAL FILTERS (MANEJO DE ERRORES)                       */
  /* -------------------------------------------------------- */
  app.useGlobalFilters(new HttpExceptionFilter())

  /* -------------------------------------------------------- */
  /* SEGURIDAD (CORS & HELMET)                                */
  /* -------------------------------------------------------- */
  app.enableCors({
    origin: origin,
    allowedHeaders: allowedHeaders,
    methods: allowedMethods,
  })

  app.use(helmet())

  /* -------------------------------------------------------- */
  /* STATIC FILES (ARCHIVOS PÚBLICOS)                         */
  /* -------------------------------------------------------- */
  app.use(express.static('public'))

  await app.listen(port || 3000)

  Logger.log(`Server started on port ${port || 3000}`, 'Bootstrap')
  Logger.log(
    `Swagger available at http://localhost:${port || 3001}/docs`,
    'Bootstrap',
  )
}
bootstrap()

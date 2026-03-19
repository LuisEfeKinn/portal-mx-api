import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function runSeeders() {
  process.env.RUN_SEEDERS = 'true'

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  })

  await app.close()
  process.exit(0)
}

runSeeders().catch((_err) => {
  process.exit(1)
})

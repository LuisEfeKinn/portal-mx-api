import { Controller, Get } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

@Controller('common')
export class HealthController {
  @Get('/health')
  @ApiOperation({
    summary: 'Health check',
  })
  // biome-ignore lint/suspicious/noEmptyBlockStatements: <lo nececesita la funcion vacia>
  healthCheck(): void {}
}

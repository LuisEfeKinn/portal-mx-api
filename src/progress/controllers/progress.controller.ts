import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ResourceAccessedDto } from '../dtos/progress.dto'
import { ProgressUseCase } from '../useCase/progress.useCase'

@ApiTags('Progreso')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('progress')
export class ProgressController {
  constructor(private readonly useCase: ProgressUseCase) {}

  @Get('me')
  @ApiOperation({
    summary: 'Consultar progreso personal por convocatoria',
    description:
      'Retorna los hitos de la convocatoria con su estado (completado o pendiente) para el aplicante autenticado.',
  })
  @ApiQuery({
    name: 'announcementId',
    required: true,
    description: 'ID de la convocatoria',
  })
  getMyProgress(
    @Req() req: { user: { id: number } },
    @Query('announcementId') announcementId: string,
  ) {
    return this.useCase.getMyProgress(req.user.id, Number(announcementId))
  }

  @Post('resource-accessed')
  @ApiOperation({
    summary: 'Registrar acceso a un recurso y marcar hito como completado',
    description:
      'Cuando el aplicante abre un recurso, se marca el hito correspondiente como completado. Es idempotente: si ya estaba completado no hace nada.',
  })
  markMilestoneByResource(
    @Req() req: { user: { id: number } },
    @Body() dto: ResourceAccessedDto,
  ) {
    return this.useCase.markMilestoneByResource(req.user.id, dto)
  }
}

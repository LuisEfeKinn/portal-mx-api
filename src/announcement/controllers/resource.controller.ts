import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import {
  CREATED_MESSAGE,
  DELETED_MESSAGE,
  UPDATED_MESSAGE,
} from 'src/shared/constants/messages.constant'
import { CreateResourceDto, UpdateResourceDto } from '../dtos/resource.dto'
import { ResourceUseCase } from '../useCase/resource.useCase'

@Controller('resources')
@ApiTags('Resources')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class ResourceController {
  constructor(private readonly resourceUseCase: ResourceUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Listar recursos por convocatoria (y opcionalmente por hito)',
  })
  @ApiQuery({ name: 'announcementId', required: true, type: Number })
  @ApiQuery({ name: 'milestoneId', required: false, type: Number })
  findAll(
    @Query('announcementId', ParseIntPipe) announcementId: number,
    @Query('milestoneId') milestoneId?: string,
  ) {
    if (milestoneId) {
      return this.resourceUseCase.findByAnnouncementAndMilestone(
        announcementId,
        Number(milestoneId),
      )
    }
    return this.resourceUseCase.findByAnnouncement(announcementId)
  }

  @Post()
  @ApiOperation({ summary: 'Crear recurso' })
  async create(@Body() dto: CreateResourceDto) {
    const rowId = await this.resourceUseCase.create(dto)
    return {
      message: CREATED_MESSAGE,
      statusCode: HttpStatus.CREATED,
      data: { rowId },
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar recurso' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateResourceDto,
  ) {
    await this.resourceUseCase.update(id, dto)
    return { message: UPDATED_MESSAGE, statusCode: HttpStatus.OK }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar recurso' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.resourceUseCase.delete(id)
    return { message: DELETED_MESSAGE, statusCode: HttpStatus.OK }
  }
}

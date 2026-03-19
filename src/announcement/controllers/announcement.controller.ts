import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AnnouncementUseCase } from '../useCase/announcement.useCase'

@Controller('announcements')
@ApiTags('Announcements')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class AnnouncementController {
  constructor(private readonly announcementUseCase: AnnouncementUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Listar convocatorias activas' })
  findAll() {
    return this.announcementUseCase.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener convocatoria por ID' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.announcementUseCase.findById(id)
  }
}

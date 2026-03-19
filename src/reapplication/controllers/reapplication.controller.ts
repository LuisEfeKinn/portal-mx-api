import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import {
  CreateReapplicationDto,
  ReapplicationFiltersDto,
} from '../dtos/reapplication.dto'
import { ReapplicationUseCase } from '../useCase/reapplication.useCase'

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const uploadInterceptor = FileInterceptor('file', {
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new BadRequestException(
          'Solo se permiten PDF, imágenes o documentos Word',
        ),
        false,
      )
    }
    cb(null, true)
  },
})

@Controller('reapplications')
@ApiTags('Reapplications')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class ReapplicationController {
  constructor(private readonly useCase: ReapplicationUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Crear solicitud de reaplicación' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['announcementId', 'incidencia', 'description'],
      properties: {
        announcementId: { type: 'number' },
        incidencia: { type: 'string' },
        description: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(uploadInterceptor)
  async create(
    @Req() req: { user: { id: number } },
    @Body() body: {
      announcementId: string
      incidencia: string
      description: string
    },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const dto: CreateReapplicationDto = {
      announcementId: Number(body.announcementId),
      incidencia: body.incidencia,
      description: body.description,
    }
    if (!dto.announcementId || !dto.incidencia || !dto.description) {
      throw new BadRequestException(
        'announcementId, incidencia y description son requeridos',
      )
    }
    const saved = await this.useCase.create(req.user.id, dto, file)
    return {
      folio: `#${String(saved.id).padStart(6, '0')}`,
      mensaje: 'Solicitud registrada correctamente',
      id: saved.id,
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Listar solicitudes. format=csv descarga el reporte.',
  })
  @ApiQuery({ name: 'announcementId', required: false })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'format', required: false, enum: ['json', 'csv'] })
  findAll(@Query() filters: ReapplicationFiltersDto) {
    if (filters.format === 'csv') return this.useCase.getCsv(filters)
    return this.useCase.findAll(filters)
  }

  @Get('me')
  @ApiOperation({ summary: 'Mis solicitudes (usuario autenticado)' })
  findMine(@Req() req: { user: { id: number } }) {
    return this.useCase.findByUser(req.user.id)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar solicitud (admin)' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.useCase.delete(id)
    return { message: 'Solicitud eliminada' }
  }
}

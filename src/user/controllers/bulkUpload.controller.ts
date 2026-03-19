import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
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
  ApiTags,
} from '@nestjs/swagger'
import { PaginateQueryRaw } from 'src/shared/dtos/paginated.dto'
import { BulkUploadUseCase } from '../useCase/bulkUpload.useCase'

@Controller('bulk-upload')
@ApiTags('Users')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class BulkUploadController {
  constructor(private readonly bulkUploadUseCase: BulkUploadUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Cargue masivo de usuarios desde Excel',
    description:
      'Sube un archivo .xlsx con los usuarios a crear. El procesamiento es asíncrono — responde de inmediato con un jobId para consultar el estado.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 50 * 1024 * 1024 },
      fileFilter: (_, file, cb) => {
        const allowed = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ]
        if (!allowed.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Solo se permiten archivos .xlsx o .xls'),
            false,
          )
        }
        cb(null, true)
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo')
    return this.bulkUploadUseCase.upload(file)
  }

  @Get()
  @ApiOperation({
    summary: 'Historial de cargues masivos',
    description:
      'Lista paginada de todos los jobs ordenados del más reciente al más antiguo.',
  })
  findAll(@Query() query: PaginateQueryRaw) {
    const page = Number(query.page) || 1
    const perPage = Number(query.perPage) || 10
    return this.bulkUploadUseCase.findAll(page, perPage)
  }

  @Get(':jobId')
  @ApiOperation({
    summary: 'Detalle de un cargue masivo',
    description:
      'Devuelve el estado y progreso de un job específico. Cuando estado=done incluye el link al reporte de errores en S3 (si hubo).',
  })
  status(@Param('jobId') jobId: string) {
    return this.bulkUploadUseCase.status(jobId)
  }
}

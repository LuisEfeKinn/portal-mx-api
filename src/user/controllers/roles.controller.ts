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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  CREATED_MESSAGE,
  DELETED_MESSAGE,
  UPDATED_MESSAGE,
} from 'src/shared/constants/messages.constant'
import { PaginateQueryRaw } from 'src/shared/dtos/paginated.dto'
import {
  CreatedRecordResponseDto,
  DeleteReCordResponseDto,
  UpdateRecordResponseDto,
} from 'src/shared/dtos/response.dto'
import { AssignPermissionsDto } from '../dtos/assignPermissions.dto'
import { RoleDetailResponseDto } from '../dtos/roleResponse.dto'
import { CreateOrUpdateRolesDto } from '../dtos/roles.dto'
import { GetAllRolesUseCase } from '../useCase/getAllRoles.useCase'
import { RoleUseCase } from '../useCase/role.useCase'

@ApiTags('Roles & Permissions')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolUseCase: RoleUseCase,
    private readonly getAllRolesUseCase: GetAllRolesUseCase,
  ) {}

  @Post('assign-permissions')
  @ApiOperation({
    summary: 'Asignar permisos a un Rol sobre un Item específico',
  })
  async assignPermissions(
    @Body() dto: AssignPermissionsDto,
  ): Promise<UpdateRecordResponseDto> {
    await this.rolUseCase.run(dto)

    return {
      message: UPDATED_MESSAGE,
      statusCode: HttpStatus.OK,
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista paginada de roles' })
  async getAllRoles(@Query() params: PaginateQueryRaw) {
    return await this.getAllRolesUseCase.getAllRoles(params)
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  async createRole(
    @Body() dto: CreateOrUpdateRolesDto,
  ): Promise<CreatedRecordResponseDto> {
    const result = await this.rolUseCase.create(dto)
    const rowId = result.id

    return {
      statusCode: HttpStatus.CREATED,
      message: CREATED_MESSAGE,
      data: { rowId },
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol por ID con sus permisos agrupados' })
  @ApiResponse({ status: HttpStatus.OK, type: RoleDetailResponseDto })
  async getRoleById(@Param('id', ParseIntPipe) id: number) {
    const data = await this.rolUseCase.getById(id)

    return {
      statusCode: HttpStatus.OK,
      message: 'Rol obtenido correctamente',
      data: data,
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar nombre o descripción de un rol' })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateOrUpdateRolesDto,
  ): Promise<UpdateRecordResponseDto> {
    await this.rolUseCase.update(id, dto)

    return {
      message: UPDATED_MESSAGE,
      statusCode: HttpStatus.OK,
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un rol' })
  async deleteRole(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteReCordResponseDto> {
    await this.rolUseCase.delete(id)
    return {
      message: DELETED_MESSAGE,
      statusCode: HttpStatus.OK,
    }
  }
}

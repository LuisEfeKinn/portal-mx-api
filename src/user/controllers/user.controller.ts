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
  Request,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import {
  CREATED_MESSAGE,
  DELETED_MESSAGE,
  UPDATED_MESSAGE,
} from 'src/shared/constants/messages.constant'
import { AccessControl } from 'src/shared/decorators/accessControl.decorator'
import { PaginateQueryRaw } from 'src/shared/dtos/paginated.dto'
import {
  CreatedRecordResponseDto,
  DeleteReCordResponseDto,
  UpdateRecordResponseDto,
} from 'src/shared/dtos/response.dto'
import { PermissionsGuard } from 'src/shared/guards/permissionsGuard'
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserProfileDto,
} from '../dtos/user.dto'
import { CrudUsersUseCase } from '../useCase/user.useCase'

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class UserController {
  constructor(private readonly crudUsersUseCase: CrudUsersUseCase) {}

  @Get('/init-data')
  async getInitData(@Request() req) {
    const userId = req.user.id
    return await this.crudUsersUseCase.getInitData(userId)
  }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<CreatedRecordResponseDto> {
    const userId = await this.crudUsersUseCase.create(dto)

    return {
      message: CREATED_MESSAGE,
      statusCode: HttpStatus.CREATED,
      data: { rowId: userId },
    }
  }

  @Patch(':id/password')
  @ApiOperation({ summary: "Update a user's password" })
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ChangePasswordDto,
  ): Promise<UpdateRecordResponseDto> {
    await this.crudUsersUseCase.updatePassword(id, data)

    return {
      statusCode: HttpStatus.OK,
      message: UPDATED_MESSAGE,
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista paginada de usuarios' })
  async getAllUsers(@Query() params: PaginateQueryRaw) {
    return await this.crudUsersUseCase.getAllUsers(params)
  }

  @Get(':id')
  //@UseGuards(AuthGuard())
  //@ApiBearerAuth()
  /*@AccessControl(1)
  @UseGuards(AuthGuard(), PermissionsGuard)
  //implementación del header x-role-id en la documentación de Swagger
  @ApiHeader({
    name: "x-role-id",
    description:
      "ID del Rol activo (ej: 1 para SuperAdmin, 2 para Admin Tienda)",
    required: true,
    schema: {
      default: "1", 
    },
  })*/
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.crudUsersUseCase.findById(id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserProfileDto,
  ): Promise<UpdateRecordResponseDto> {
    await this.crudUsersUseCase.update(id, dto)

    return {
      message: UPDATED_MESSAGE,
      statusCode: HttpStatus.OK,
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteReCordResponseDto> {
    await this.crudUsersUseCase.delete(id)

    return {
      message: DELETED_MESSAGE,
      statusCode: HttpStatus.OK,
    }
  }
}

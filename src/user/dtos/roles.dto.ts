import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateOrUpdateRolesDto {
  @ApiProperty({
    description: 'Nombre único del rol',
    type: String,
    required: true,
    example: 'Administrador',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  name: string

  @ApiProperty({
    description: 'Descripción detallada del rol',
    type: String,
    required: false,
    example: 'Tiene acceso a todos los módulos del sistema',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'La descripción no puede tener más de 255 caracteres',
  })
  description?: string
}

export const VALID_FIELDS_ROLES_ORDER = [
  'roles.id',
  'roles.name',
  'roles.description',
  'roles.createdAt',
]

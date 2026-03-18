import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { Match } from 'src/shared/validators/match.validator'

export class CreateUserDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsOptional()
  firstName?: string

  @ApiProperty({ example: 'Carlos' })
  @IsString()
  @IsOptional()
  secondName?: string

  @ApiProperty({ example: 'Perez' })
  @IsString()
  @IsOptional()
  firstLastname?: string

  @ApiProperty({ example: 'Gomez' })
  @IsString()
  @IsOptional()
  secondLastname?: string

  @ApiProperty({ example: 'Juan Perez' })
  @IsString()
  @IsOptional()
  displayName?: string

  @ApiProperty({ example: 'juan.perez@email.com' })
  @IsEmail()
  @MaxLength(255)
  email: string

  @ApiProperty({
    type: String,
    required: true,
    example: '********',
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string

  @ApiProperty({
    type: String,
    required: false,
    example: '********',
  })
  @IsString()
  @Match('password')
  @MinLength(6)
  @IsOptional()
  passwordConfirmation?: string

  @ApiProperty({ example: '+57 300 1234567' })
  @IsString()
  @IsOptional()
  mobile?: string

  @ApiProperty({ example: '038 1234567' })
  @IsString()
  @IsOptional()
  homePhone?: string

  @ApiProperty({ example: 'Calle 123 # 45-67' })
  @IsString()
  @IsOptional()
  direction?: string

  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsOptional()
  identification?: string

  @ApiProperty({ example: 1, description: 'ID del tipo de identificación' })
  @IsNumber()
  @IsOptional()
  identificationTypeId?: number

  @ApiProperty({ example: 1, description: 'ID del municipio de residencia' })
  @IsNumber()
  @IsOptional()
  homeMunicipalityId?: number

  @ApiProperty({ example: 1, description: 'ID del género' })
  @IsNumber()
  @IsOptional()
  genderId?: number

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  @IsOptional()
  birthDate?: string

  @ApiProperty({ example: 'https://url-avatar.com/img.png' })
  @IsString()
  @IsOptional()
  avatar?: string

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  acceptedTerms?: boolean

  @ApiProperty({ example: [1, 2], description: 'IDs de roles a asignar' })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  roleIds?: number[]
}

export class UpdateUserProfileDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsOptional()
  firstName?: string

  @ApiProperty({ example: 'Carlos' })
  @IsString()
  @IsOptional()
  secondName?: string

  @ApiProperty({ example: 'Perez' })
  @IsString()
  @IsOptional()
  firstLastname?: string

  @ApiProperty({ example: 'Gomez' })
  @IsString()
  @IsOptional()
  secondLastname?: string

  @ApiProperty({ example: 'Juan Perez' })
  @IsString()
  @IsOptional()
  displayName?: string

  @ApiProperty({ example: 'juan.perez@email.com' })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({ example: '+57 300 1234567' })
  @IsString()
  @IsOptional()
  mobile?: string

  @ApiProperty({ example: '038 1234567' })
  @IsString()
  @IsOptional()
  homePhone?: string

  @ApiProperty({ example: 'Calle 123 # 45-67' })
  @IsString()
  @IsOptional()
  direction?: string

  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsOptional()
  identification?: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  identificationTypeId?: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  homeMunicipalityId?: number

  @ApiProperty({ example: 1, description: 'ID del género' })
  @IsNumber()
  @IsOptional()
  genderId?: number

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  @IsOptional()
  birthDate?: string

  @ApiProperty({ example: 'https://url-avatar.com/img.png' })
  @IsString()
  @IsOptional()
  avatar?: string

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isProfileCompleted?: boolean

  @ApiProperty({ example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  roleIds?: number[]
}

export class ForgotPasswordDto {
  @ApiProperty({
    type: 'email',
    required: true,
    example: 'haroldmosquera739@gmail.com',
  })
  @IsEmail()
  email: string
}

export class ChangePasswordDto {
  @ApiProperty({
    type: String,
    required: true,
    example: ' ********',
  })
  @IsString()
  @MinLength(6)
  password: string
}

export class ChangeAvatarDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'avatar.png',
  })
  @IsString()
  avatar: string
}

export const VALID_FIELDS_USERS_ORDER = [
  'users.id',
  'users.firstName',
  'users.firstLastname',
  'users.email',
  'users.createdAt',
  'users.isActive',
]

export class UserResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  fullName: string

  @ApiProperty()
  email: string

  @ApiProperty()
  identification: string

  @ApiProperty()
  roles: string[]

  @ApiProperty()
  mobile: string

  @ApiProperty()
  isActive: boolean

  @ApiProperty()
  createdAt: Date
}

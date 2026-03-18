import { ApiProperty } from '@nestjs/swagger'
import {
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

export class SignUpDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  firstName: string

  @ApiProperty({ example: 'Carlos', required: false })
  @IsString()
  @IsOptional()
  secondName?: string

  @ApiProperty({ example: 'Perez' })
  @IsString()
  firstLastname: string

  @ApiProperty({ example: 'Gomez', required: false })
  @IsString()
  @IsOptional()
  secondLastname?: string

  @ApiProperty({ example: 'Juan Perez', required: false })
  @IsString()
  @IsOptional()
  displayName?: string

  @ApiProperty({ example: 'juan.perez@email.com' })
  @IsEmail()
  @MaxLength(255)
  email: string

  @ApiProperty({ example: '********', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ example: '********', minLength: 6 })
  @IsString()
  @MinLength(6)
  @Match('password', { message: 'Las contraseñas no coinciden' })
  passwordConfirmation: string

  @ApiProperty({ example: '+57 300 1234567', required: false })
  @IsString()
  @IsOptional()
  mobile?: string

  @ApiProperty({ example: '038 1234567', required: false })
  @IsString()
  @IsOptional()
  homePhone?: string

  @ApiProperty({ example: 'Calle 123 # 45-67', required: false })
  @IsString()
  @IsOptional()
  direction?: string

  @ApiProperty({ example: '123456789', required: false })
  @IsString()
  @IsOptional()
  identification?: string

  @ApiProperty({
    example: 1,
    description: 'ID del tipo de identificación',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  identificationTypeId?: number

  @ApiProperty({
    example: 1,
    description: 'ID del municipio de residencia',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  homeMunicipalityId?: number

  @ApiProperty({ example: 1, description: 'ID del género', required: false })
  @IsNumber()
  @IsOptional()
  genderId?: number

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  @IsOptional()
  birthDate?: string

  @ApiProperty({ example: 'https://url-avatar.com/img.png', required: false })
  @IsString()
  @IsOptional()
  avatar?: string

  @ApiProperty({ example: true })
  @IsBoolean()
  acceptedTerms: boolean
}

export class SignUpResponseDto {
  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  accessToken: string

  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  refreshToken: string

  @ApiProperty({
    type: Number,
    example: 1,
  })
  userId: number
}

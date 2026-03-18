import { HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

import { IsEmail, IsString } from 'class-validator'
import { UNAUTHORIZED_MESSAGE } from 'src/shared/constants/messages.constant'
import { BaseResponseDto } from 'src/shared/dtos/response.dto'

import { INVALID_ACCESS_DATA_MESSAGE } from '../constant/messages.constant'

export class SignInRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'john.doe@gmail.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    type: String,
    required: true,
    example: '1111',
  })
  @IsString()
  password: string
}

export class AuthTokenResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @IsString()
  accessToken: string

  @ApiProperty({
    type: String,
    required: true,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @IsString()
  refreshToken: string
}

export class RefreshTokenRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @IsString()
  refreshToken: string
}

export class InvalidAccessDataResponseDto implements BaseResponseDto {
  @ApiProperty({
    type: String,
    example: INVALID_ACCESS_DATA_MESSAGE,
  })
  message: string

  @ApiProperty({
    type: Number,
    example: HttpStatus.UNAUTHORIZED,
  })
  statusCode: number

  @ApiProperty({
    type: String,
    example: UNAUTHORIZED_MESSAGE,
  })
  error: string
}

export class ChangePasswordUserDto {
  @ApiProperty({
    type: String,
    required: true,
    example: '12345678',
  })
  @IsString()
  oldPassword: string

  @ApiProperty({
    type: String,
    required: true,
    example: '123456789',
  })
  @IsString()
  password: string

  @ApiProperty({
    type: String,
    required: true,
    example: '123456789',
  })
  @IsString()
  passwordConfirmation: string
}

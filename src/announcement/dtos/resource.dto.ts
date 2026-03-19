import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator'

export class CreateResourceDto {
  @ApiProperty({ example: 'Guía de inscripción' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 'https://example.com/guia' })
  @IsString()
  @IsNotEmpty()
  url: string

  @ApiProperty({
    required: false,
    example: 'Documento con los pasos para inscribirse',
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  announcementId: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  milestoneId: number
}

export class UpdateResourceDto extends PartialType(CreateResourceDto) {}

export class ResourceResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  title: string

  @ApiProperty()
  url: string

  @ApiProperty({ required: false })
  description?: string

  @ApiProperty()
  announcementId: number

  @ApiProperty()
  milestoneId: number

  @ApiProperty()
  createdAt: Date
}

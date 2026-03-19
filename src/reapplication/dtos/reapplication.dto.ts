import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { PaginateQueryRaw } from 'src/shared/dtos/paginated.dto'

export class CreateReapplicationDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  announcementId: number

  @ApiProperty({ example: 'Urgencia o suceso médico' })
  @IsString()
  @IsNotEmpty()
  incidencia: string

  @ApiProperty({ example: 'Tuve un accidente y adjunto historial clínico.' })
  @IsString()
  @IsNotEmpty()
  description: string
}

export class ReapplicationFiltersDto extends PaginateQueryRaw {
  @ApiProperty({ required: false })
  @IsOptional()
  announcementId?: string

  @ApiProperty({ required: false, example: '2026-03-01' })
  @IsOptional()
  fromDate?: string

  @ApiProperty({ required: false, example: '2026-03-31' })
  @IsOptional()
  toDate?: string

  @ApiProperty({
    required: false,
    enum: ['json', 'csv'],
    description: 'Formato de respuesta',
  })
  @IsOptional()
  format?: 'json' | 'csv'
}

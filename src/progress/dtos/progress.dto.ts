import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

export class ResourceAccessedDto {
  @ApiProperty({ description: 'ID del recurso al que accedió el aplicante' })
  @Type(() => Number)
  @IsNumber()
  resourceId: number

  @ApiProperty({ description: 'ID de la convocatoria activa' })
  @Type(() => Number)
  @IsNumber()
  announcementId: number
}

export class MarkMilestoneDto {
  @ApiProperty({ description: 'ID del hito a marcar como completado' })
  @Type(() => Number)
  @IsNumber()
  milestoneId: number

  @ApiProperty({ description: 'ID de la convocatoria' })
  @Type(() => Number)
  @IsNumber()
  announcementId: number
}

export class ProgressQueryDto {
  @ApiPropertyOptional({ description: 'ID de la convocatoria' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  announcementId?: number
}

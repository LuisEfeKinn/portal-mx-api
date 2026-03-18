import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { ToBoolean } from '../decorators/toBoolean.decorator'

export class PaginateQueryRaw {
  @ApiProperty({
    type: String,
    required: false,
    example: '1',
  })
  @IsString()
  page?: string
  @ApiProperty({
    type: String,
    required: false,
    example: '10',
  })
  @IsString()
  perPage?: string

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string

  @ApiProperty({
    type: String,
    required: false,
    example: 'table.field:order',
  })
  @IsString()
  @IsOptional()
  sort?: string
}
export interface Paginated<T> {
  rows: T[]
  metadata: Metadata
}
export interface Metadata {
  totalPages: number
  totalItems: number
  itemsPerPage: number
  currentPage: number
  searchTerm: string
  nextPage: number
}

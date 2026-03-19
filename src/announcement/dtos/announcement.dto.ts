import { ApiProperty } from '@nestjs/swagger'

export class AnnouncementResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty({ required: false })
  description?: string

  @ApiProperty()
  isActive: boolean

  @ApiProperty()
  createdAt: Date
}

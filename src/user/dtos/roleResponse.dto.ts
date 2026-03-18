import { ApiProperty } from '@nestjs/swagger'

export class PermissionResponseDto {
  @ApiProperty()
  id: number
  @ApiProperty()
  name: string
}

export class ItemResponseDto {
  @ApiProperty()
  id: number
  @ApiProperty()
  name: string
  @ApiProperty()
  icon: string
  @ApiProperty()
  route: string
  @ApiProperty({ type: [PermissionResponseDto] })
  permissions: PermissionResponseDto[]
}

export class ModuleResponseDto {
  @ApiProperty()
  id: number
  @ApiProperty()
  name: string
  @ApiProperty()
  icon: string
  @ApiProperty({ type: [ItemResponseDto] })
  items: ItemResponseDto[]
}

export class RoleDetailResponseDto {
  @ApiProperty()
  id: number
  @ApiProperty()
  name: string
  @ApiProperty()
  description: string
  @ApiProperty({ type: [ModuleResponseDto] })
  modules: ModuleResponseDto[]
}

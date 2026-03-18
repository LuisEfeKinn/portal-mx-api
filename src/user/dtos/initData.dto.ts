import { ApiProperty } from '@nestjs/swagger'

export class PermissionDto {
  @ApiProperty()
  name: string
}

export class MenuItemDto {
  id: number
  name: string
  icon: string
  path: string
  order: number
  itemparentId: number | null
  permissions: string[]
  children: MenuItemDto[]
}

export class ModuleDto {
  moduleId: number
  subheader: string
  icon: string
  order: number
  items: MenuItemDto[]
}

export class RoleContextDto {
  id: number
  name: string
  description: string
  modules: ModuleDto[]
}

export class InitDataResponseDto {
  id: number
  names: string
  email: string
  roles: RoleContextDto[]
}

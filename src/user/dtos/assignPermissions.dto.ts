import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class AssignPermissionsDto {
  @ApiProperty({
    example: 1,
    description: 'ID del Rol al que asignamos permisos',
  })
  @IsNumber()
  @IsNotEmpty()
  roleId: number

  @ApiProperty({ example: 32, description: 'ID del Item (Pantalla/Recurso)' })
  @IsNumber()
  @IsNotEmpty()
  itemId: number

  @ApiProperty({
    example: [1, 2],
    description: 'Array con los IDs de permisos (1=Ver, 2=Editar, etc)',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds: number[]
}

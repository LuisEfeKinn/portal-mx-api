import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RolItemPermissionRepository } from 'src/user/repositories/rolItemPermission.repository'
import { UserRoleRepository } from 'src/user/repositories/userRol.repository'
import { ACCESS_CONTROL_KEY } from '../decorators/accessControl.decorator'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolItemPermissionRepository: RolItemPermissionRepository,
    private readonly userRoleRepository: UserRoleRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredItemId = this.reflector.getAllAndOverride<number>(
      ACCESS_CONTROL_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredItemId) return true

    const request = context.switchToHttp().getRequest()

    const user = request.user

    if (!user || !user.id) {
      throw new UnauthorizedException(
        'Usuario no identificado o token inválido',
      )
    }

    const activeRoleId = request.headers['x-role-id']

    if (!activeRoleId) {
      throw new ForbiddenException('Header x-role-id es requerido')
    }

    const hasRole = await this.userRoleRepository.findOne({
      where: { userId: user.id, roleId: Number(activeRoleId) },
    })

    if (!hasRole) throw new ForbiddenException('No tienes asignado este rol')

    const action = this.mapMethodToAction(request.method)

    const permissionExists = await this.rolItemPermissionRepository.findOne({
      where: {
        roleId: Number(activeRoleId),
        itemId: requiredItemId,
        permission: { name: action },
      },
      relations: ['permission'],
    })

    if (!permissionExists) {
      throw new ForbiddenException(`Sin permisos para ${action}`)
    }

    return true
  }

  private mapMethodToAction(method: string): string {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'view'
      case 'POST':
        return 'create'
      case 'PATCH':
        return 'edit'
      case 'PUT':
        return 'edit'
      case 'DELETE':
        return 'delete'
      default:
        return 'view'
    }
  }
}

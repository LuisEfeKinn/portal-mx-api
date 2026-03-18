import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { RolRepository } from 'src/user/repositories/rol.repository'
import { CrudUserService } from 'src/user/services/crudUser.service'
import { SignUpDto, SignUpResponseDto } from '../dtos/signUp.dto'
import { AuthService } from '../services/auth.service'

export const roleKeys = {
  admin: 'admin',
  user: 'user',
} as const

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly crudUserService: CrudUserService,
    private readonly authService: AuthService,
    private readonly rolRepository: RolRepository,
  ) {}

  async signUpCustomer(dto: SignUpDto): Promise<SignUpResponseDto> {
    if (!dto.acceptedTerms) {
      throw new BadRequestException('Debe aceptar los términos y condiciones')
    }

    const userRole = await this.findRoleByKey(roleKeys.user)

    const userId = await this.crudUserService.create({
      ...dto,
      isActive: true,
      roleIds: [userRole.id],
    })

    const tokens = this.authService.generateTokens({
      email: dto.email,
      sub: userId,
    })

    return {
      ...tokens,
      userId,
    }
  }

  private async findRoleByKey(key: string) {
    const role = await this.rolRepository.findOneBy({ key })
    if (!role) {
      throw new NotFoundException(`Rol del sistema no encontrado: ${key}`)
    }
    return role
  }
}

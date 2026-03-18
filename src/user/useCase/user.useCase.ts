import { Injectable } from '@nestjs/common'
import { PaginateQueryRaw } from 'src/shared/dtos/paginated.dto'
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserProfileDto,
} from '../dtos/user.dto'
import { CrudUserService } from '../services/crudUser.service'
import { GetAllUserService } from '../services/getAllUser.service'
import { InitDataService } from '../services/initData.service'

@Injectable()
export class CrudUsersUseCase {
  constructor(
    private readonly crudUserService: CrudUserService,
    private readonly initDataService: InitDataService,
    private readonly getAllUserService: GetAllUserService,
  ) {}

  async create(dto: CreateUserDto): Promise<number> {
    if (dto.email) {
      dto.email = dto.email.toLowerCase()
    }
    return await this.crudUserService.create(dto)
  }

  async update(id: number, dto: UpdateUserProfileDto): Promise<void> {
    if (dto.email) {
      dto.email = dto.email.toLowerCase()
    }
    await this.crudUserService.update(id, dto)
  }

  async findById(id: number) {
    const user = await this.crudUserService.findOrFailById(id)

    const { password, keyChangePassword, rememberToken, ...cleanUser } = user

    return cleanUser
  }

  async delete(id: number) {
    await this.crudUserService.delete(id)
  }

  async updatePassword(id: number, dto: ChangePasswordDto): Promise<void> {
    await this.crudUserService.updatePassword(id, dto.password)
  }

  async getInitData(userId: number) {
    return await this.initDataService.getInitData(userId)
  }

  async getAllUsers(params: PaginateQueryRaw) {
    return await this.getAllUserService.getAllUsers(params)
  }
}

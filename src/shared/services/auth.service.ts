import { Injectable } from '@nestjs/common'

import { UserAuthModel } from '../model/auth.model'
import { BlackListTokenRepository } from '../repositories/blackListToken.repository'
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly blackListTokenRepository: BlackListTokenRepository,
  ) {}

  async validateSession(data: {
    userId: number
    token: string
  }): Promise<UserAuthModel | null> {
    const blackList = await this.blackListTokenRepository.findOneBy({
      token: data.token,
    })

    if (blackList) {
      return null
    }

    const user = await this.userRepository.findOneBy({
      id: data.userId,
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
    }
  }
}

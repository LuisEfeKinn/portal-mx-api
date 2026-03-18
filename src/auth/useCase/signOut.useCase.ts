import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { BlackListTokenRepository } from 'src/shared/repositories/blackListToken.repository'

import { AuthTokenResponseDto } from '../dtos/auth.dto'

@Injectable()
export class SignOutUseCase {
  constructor(
    private readonly blackListTokenRepository: BlackListTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async run(data: AuthTokenResponseDto): Promise<void> {
    try {
      this.jwtService.verify(data.refreshToken)
    } catch (_e) {
      throw new UnauthorizedException()
    }

    await this.blackListTokenRepository.insert([
      {
        token: data.accessToken,
      },
      {
        token: data.refreshToken,
      },
    ])
  }
}

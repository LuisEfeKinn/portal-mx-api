import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { BlackListTokenRepository } from 'src/shared/repositories/blackListToken.repository'
import { AuthService as SharedAuthService } from 'src/shared/services/auth.service'
import { AuthTokenResponseDto } from '../dtos/auth.dto'
import { AuthService } from '../services/auth.service'

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly sharedAuthService: SharedAuthService,
    private readonly jwtService: JwtService,
    private readonly blackListTokenRepository: BlackListTokenRepository,
  ) {}

  async run(refreshToken: string): Promise<AuthTokenResponseDto> {
    let payload
    try {
      payload = this.jwtService.verify(refreshToken)
    } catch (_e) {
      throw new UnauthorizedException()
    }

    const user = await this.sharedAuthService.validateSession({
      token: refreshToken,
      userId: payload.sub,
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    const result = await this.authService.generateTokens({
      sub: user.id,
      email: user.email,
    })

    await this.blackListTokenRepository.insert({
      token: refreshToken,
    })

    return result
  }
}

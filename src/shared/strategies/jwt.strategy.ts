import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwt, Strategy } from 'passport-jwt'
import { TokenPayloadModel, UserAuthModel } from '../model/auth.model'
import { AuthService } from '../services/auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt.secret'),
      passReqToCallback: true,
    })
  }

  async validate(req, payload: TokenPayloadModel): Promise<UserAuthModel> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)

    const user = await this.authService.validateSession({
      userId: payload.sub,
      token,
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}

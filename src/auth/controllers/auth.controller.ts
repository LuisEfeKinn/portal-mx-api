import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { Request } from 'express'
import { UNAUTHORIZED_RESPONSE } from 'src/shared/constants/response.constant'
import { ForgotPasswordDto } from 'src/user/dtos/user.dto'
import { INVALID_ACCESS_DATA_MESSAGE } from '../constant/messages.constant'
import {
  AuthTokenResponseDto,
  ChangePasswordUserDto,
  InvalidAccessDataResponseDto,
  RefreshTokenRequestDto,
  SignInRequestDto,
} from '../dtos/auth.dto'
import { SignUpDto, SignUpResponseDto } from '../dtos/signUp.dto'
import { ForgotPasswordUseCase } from '../useCase/forgotPasswordUseCase.UseCase'
import { RefreshTokenUseCase } from '../useCase/refreshToken.useCase'
import { SignInUseCase } from '../useCase/signIn.useCase'
import { SignOutUseCase } from '../useCase/signOut.useCase'
import { SignUpUseCase } from '../useCase/signUp.useCase'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly signOutUseCase: SignOutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly signUpUseCase: SignUpUseCase,
  ) {}

  @Post('sign-in')
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: INVALID_ACCESS_DATA_MESSAGE,
    type: InvalidAccessDataResponseDto,
  })
  @ApiOkResponse({ type: AuthTokenResponseDto })
  signIn(@Body() body: SignInRequestDto) {
    return this.signInUseCase.run(body)
  }

  @Post('sign-out')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiUnauthorizedResponse(UNAUTHORIZED_RESPONSE)
  async signOut(
    @Req() req: Request,
    @Body() body: AuthTokenResponseDto,
  ): Promise<void> {
    await this.signOutUseCase.run({
      accessToken: req.headers.authorization.split(' ')[1],
      refreshToken: body.refreshToken,
    })
  }

  @Post('change-password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  changePassword(@Req() req, @Body() body: ChangePasswordUserDto) {
    return this.forgotPasswordUseCase.changePassword(body, req.user.id)
  }

  @Post('refresh-token')
  @ApiUnauthorizedResponse(UNAUTHORIZED_RESPONSE)
  @ApiOkResponse({ type: AuthTokenResponseDto })
  refreshToken(
    @Body() body: RefreshTokenRequestDto,
  ): Promise<AuthTokenResponseDto> {
    return this.refreshTokenUseCase.run(body.refreshToken)
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    await this.forgotPasswordUseCase.run(data.email)
    return {
      message: 'Email de recuperación enviado',
      statusCode: HttpStatus.OK,
    }
  }

  @Post('signup')
  @ApiOkResponse({ type: SignUpResponseDto, description: 'Registro exitoso' })
  signUp(@Body() body: SignUpDto): Promise<SignUpResponseDto> {
    return this.signUpUseCase.signUpCustomer(body)
  }
}

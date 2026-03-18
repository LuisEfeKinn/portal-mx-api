import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { AuthService } from 'src/auth/services/auth.service'
import { PasswordService } from 'src/shared/services/password.service'
import { SendEmailsService } from 'src/shared/services/sendEmails.service'
import { CrudUserService } from 'src/user/services/crudUser.service'
import { ChangePasswordUserDto } from '../dtos/auth.dto'

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private readonly crudUserService: CrudUserService,
    private readonly sendEmailService: SendEmailsService,
    private readonly generateTokenService: AuthService,
    private readonly passwordService: PasswordService,
  ) {}

  async run(email: string) {
    const user = await this.crudUserService.findByEmail(email)

    if (user) {
      const token = await this.generateTokenService.generateTokens({
        sub: user.id,
        email: user.email,
      })

      const urlToReset = `${process.env.URL_FRONTEND_REDIRECT}/reset-password?token=${token.accessToken}`

      const userName = user.displayName || user.firstName || 'Usuario'

      await this.sendEmailService.sendEmails(
        [
          {
            email: user.email,
            body: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de Contraseña</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <img src="https://portal.kamilainnovation.com.co/wp-content/uploads/2023/02/Kamila-Innovation.png" alt="Logo" style="max-width: 180px;">
            </td>
        </tr>
        <tr>
            <td>
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                    <tr>
                        <td>
                            <h1 style="color: #0066cc; margin-bottom: 20px; font-size: 22px; text-align: center;">Recuperación de Contraseña</h1>
                            
                            <p>Estimado/a <strong>${userName}</strong>,</p>
                            
                            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no has realizado esta solicitud, puedes ignorar este mensaje.</p>
                            <p>Para continuar con el restablecimiento, haz clic en el siguiente botón:</p>
                            <div style="text-align: center; margin: 25px 0;">
                                <a href="${urlToReset}" style="display: inline-block; background-color: #0066cc; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 16px;">Restablecer Contraseña</a>
                            </div>
                            <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
                            <p style="word-break: break-all; color: #0066cc; font-size: 14px;">
                                <a href="${urlToReset}" style="color: #0066cc; text-decoration: none;">${urlToReset}</a>
                            </p>
                            <p><em>Este enlace expirará en 24 horas por motivos de seguridad.</em></p>
                            <p style="margin-top: 30px;">Atentamente,<br>
                            <strong>Equipo de Soporte</strong></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; padding: 15px 0; font-size: 12px; color: #777;">
                &copy; ${new Date().getFullYear()} Todos los derechos reservados.
            </td>
        </tr>
    </table>
</body>
</html>
`,
          },
        ],
        'Restablecimiento de contraseña',
      )
    }
  }

  async changePassword(data: ChangePasswordUserDto, userId: number) {
    try {
      if (!data.oldPassword || !data.password || !data.passwordConfirmation) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Todos los campos de contraseña son obligatorios',
          error: 'MissingPasswordFields',
        })
      }

      if (data.password !== data.passwordConfirmation) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'La confirmación no coincide con la nueva contraseña',
          error: 'PasswordMismatch',
        })
      }

      const user = await this.crudUserService.findOrFailById(userId)

      const passwordCorrect = await this.passwordService.compare(
        data.oldPassword,
        user.password,
      )

      if (!passwordCorrect) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'La contraseña anterior no es correcta',
          error: 'WrongOldPassword',
        })
      }

      const newPassword = await this.passwordService.generateHash(data.password)

      await this.crudUserService.updatePassword(userId, newPassword)

      return {
        statusCode: HttpStatus.OK,
        message: 'Contraseña cambiada exitosamente',
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al cambiar la contraseña',
          error: error.message || 'Error desconocido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}

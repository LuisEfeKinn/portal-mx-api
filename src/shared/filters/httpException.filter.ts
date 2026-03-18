import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common'

import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    let status = 500
    let responseAux: string | object = 'Internal Error'

    const serviceErrorMessage = 'Service Error'
    const { method, url, params, body, headers } = request

    try {
      status = exception.getStatus()
      responseAux = exception.getResponse()

      if (typeof responseAux === 'string') {
        responseAux = {
          message: responseAux,
          statusCode: status,
          error: serviceErrorMessage,
        }
      }
    } catch (_error) {
      status = 500
      responseAux = {
        message: serviceErrorMessage,
        statusCode: status,
        error: serviceErrorMessage,
      }
    }

    const errorAux = exception.message
    const message = `${method} ${url} ${status}`

    if (status >= 400 && status < 500 && request.path !== '/favicon.ico') {
      this.logger.warn({
        message,
        method,
        url,
        status,
        request: {
          params,
          body,
          headers,
        },
        response: responseAux,
        error: errorAux,
      })
    } else if (status >= 500) {
      this.logger.error(
        {
          message,
          method,
          url,
          status,
          request: {
            params,
            body,
            headers,
          },
          response: responseAux,
          error: errorAux,
        },
        exception.stack,
      )
    }

    response.status(status).json(responseAux)
  }
}

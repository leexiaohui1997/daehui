import { API_ERROR_MAP, ApiCode, ApiError } from '@daehui/shared'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let code = -1
    let message = 'Internal server error'
    let status = HttpStatus.INTERNAL_SERVER_ERROR

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      // 处理参数校验错误
      if (status === HttpStatus.BAD_REQUEST) {
        code = ApiCode.PARAM_ERROR
        message = API_ERROR_MAP[code]
        status = 200
      }

      const res = exceptionResponse as { message?: string[] }
      if (
        typeof res === 'object' &&
        res !== null &&
        Array.isArray(res.message)
      ) {
        message = res.message[0]
      } else {
        message =
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as { message?: string }).message ||
              exception.message
      }
    } else if (exception instanceof Error) {
      message = exception.message
      if (exception instanceof ApiError) {
        code = exception.code
        status = 200
      }
    }

    response.status(status).json({
      code,
      msg: message,
    })
  }
}

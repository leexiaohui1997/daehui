import { ApiCode, ApiError } from '@daehui/shared'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'

import { UserInfo } from '../../modules/user/interfaces/user-info.interface'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const user = request['user'] as UserInfo

    if (!user || !user.isAdmin) {
      throw new ApiError(ApiCode.FORBIDDEN)
    }

    return true
  }
}

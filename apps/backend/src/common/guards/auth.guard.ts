import { ApiCode, ApiError } from '@daehui/shared'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

import { RedisService } from '../../modules/redis/redis.service'
import { UserInfo } from '../../modules/user/interfaces/user-info.interface'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new ApiError(ApiCode.UNAUTHORIZED)
    }

    try {
      // 1. 验证 JWT 基本合法性
      const payload = await this.jwtService.verifyAsync<UserInfo>(token)

      // 2. 验证 Redis 中的 Token 是否匹配
      const storedToken = await this.redisService.get(
        `auth:token:${payload.sub}`,
      )
      if (!storedToken || storedToken !== token) {
        throw new ApiError(ApiCode.UNAUTHORIZED)
      }

      // 3. 注入用户信息
      request['user'] = payload
    } catch {
      throw new ApiError(ApiCode.UNAUTHORIZED)
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

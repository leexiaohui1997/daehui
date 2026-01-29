import { ApiCode, ApiError, parseTimeToSeconds } from '@daehui/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { User } from '../../entities/user/user.entity'
import { RedisService } from '../redis/redis.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 用户注册
   * @param dto 注册信息
   */
  async register(dto: RegisterDto): Promise<void> {
    const { username, password } = dto

    // 检查用户是否存在
    const existUser = await this.userRepository.findOne({
      where: { username },
    })

    if (existUser) {
      throw new ApiError(ApiCode.USER_ALREADY_EXISTS)
    }

    // 密码加密
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    // 创建用户
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    })

    await this.userRepository.save(user)
  }

  /**
   * 用户登录
   * @param dto 登录信息
   */
  async login(dto: LoginDto): Promise<{ token: string }> {
    const { username, password } = dto

    // 查询用户并包含密码
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'isAdmin'],
    })

    if (!user) {
      throw new ApiError(ApiCode.LOGIN_FAILED)
    }

    // 校验密码
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new ApiError(ApiCode.LOGIN_FAILED)
    }

    // 生成 Token
    const payload = {
      sub: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    }
    const token = await this.jwtService.signAsync(payload)

    // 存入 Redis，Key 为 auth:token:${userId}，过期时间与 JWT 一致
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '7d')
    const ttl = parseTimeToSeconds(expiresIn)
    await this.redisService.set(`auth:token:${user.id}`, token, ttl)

    return { token }
  }

  /**
   * 用户登出
   * @param userId 用户 ID
   */
  async logout(userId: number): Promise<void> {
    await this.redisService.del(`auth:token:${userId}`)
  }
}

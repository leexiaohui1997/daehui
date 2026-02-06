import { ApiCode, ApiError, parseTimeToSeconds } from '@daehui/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { In } from 'typeorm'

import { BaseRepository } from '../../common/database/base.repository'
import { InjectBaseRepository } from '../../common/database/base-repository.decorator'
import { Role } from '../../entities/role/role.entity'
import { User } from '../../entities/user/user.entity'
import { RedisService } from '../redis/redis.service'
import { AddUserRolesDto } from './dto/add-user-roles.dto'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UserQueryDto } from './dto/user-query.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectBaseRepository(User)
    private readonly userRepository: BaseRepository<User>,
    @InjectBaseRepository(Role)
    private readonly roleRepository: BaseRepository<Role>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 分页查询用户列表
   * @param dto 查询参数
   */
  async findList(dto: UserQueryDto): Promise<{ list: User[]; total: number }> {
    return this.userRepository.findListByDto(dto)
  }

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

  /**
   * 给用户添加角色
   * @param dto 添加角色参数
   */
  async addRoles(dto: AddUserRolesDto): Promise<void> {
    const { userId, roleIds } = dto

    // 1. 查询用户及其现有角色
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    })

    if (!user) {
      throw new ApiError(ApiCode.PARAM_ERROR, '用户不存在')
    }

    // 2. 校验所有角色ID是否存在
    const roles = await this.roleRepository.findBy({
      id: In(roleIds),
    })

    if (roles.length !== roleIds.length) {
      throw new ApiError(ApiCode.PARAM_ERROR, '部分角色不存在')
    }

    // 3. 合并角色（去重）
    const existingRoleIds = new Set(user.roles.map(r => r.id))
    const newRoles = roles.filter(r => !existingRoleIds.has(r.id))

    user.roles = [...user.roles, ...newRoles]

    // 4. 保存
    await this.userRepository.save(user)
  }
}

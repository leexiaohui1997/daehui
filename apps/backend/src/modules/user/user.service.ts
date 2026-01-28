import { ApiCode, ApiError } from '@daehui/shared'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { User } from '../../entities/user/user.entity'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}

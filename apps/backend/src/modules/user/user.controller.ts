import { ApiError } from '@daehui/shared'
import { Body, Controller, Get, Post } from '@nestjs/common'

import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto)
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.userService.login(dto)
  }

  @Get('me')
  getMe() {
    // throw new Error('Not implemented')
    throw new ApiError()
    // return '111'
  }
}

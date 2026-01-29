import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthGuard } from '../../common/guards/auth.guard'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UserInfo } from './interfaces/user-info.interface'
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
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: UserInfo) {
    return {
      username: user.username,
      isAdmin: user.isAdmin,
    }
  }
}

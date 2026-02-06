import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AdminGuard } from '../../common/guards/admin.guard'
import { AuthGuard } from '../../common/guards/auth.guard'
import { User } from '../../entities/user/user.entity'
import { AddUserRolesDto } from './dto/add-user-roles.dto'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UserQueryDto } from './dto/user-query.dto'
import { UserInfo } from './interfaces/user-info.interface'
import { UserService } from './user.service'

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
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

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@CurrentUser() user: UserInfo) {
    return this.userService.logout(user.sub)
  }

  /**
   * 分页获取用户列表
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Post('list')
  async findList(
    @Body() dto: UserQueryDto,
  ): Promise<{ list: User[]; total: number }> {
    return this.userService.findList(dto)
  }

  /**
   * 给用户添加角色
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Post('add-roles')
  async addRoles(@Body() dto: AddUserRolesDto): Promise<void> {
    return this.userService.addRoles(dto)
  }
}

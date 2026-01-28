import { ApiError } from '@daehui/shared'
import { Controller, Get } from '@nestjs/common'

import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe() {
    // throw new Error('Not implemented')
    throw new ApiError()
    // return '111'
  }
}

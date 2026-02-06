import { Module } from '@nestjs/common'

import { TypeOrmExModule } from '../../common/database/typeorm-ex.module'
import { Role } from '../../entities/role/role.entity'
import { User } from '../../entities/user/user.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmExModule.forFeature([User, Role])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Permission } from '../../entities/permission.entity'
import { UserModule } from '../user/user.module'
import { PermissionController } from './permission.controller'
import { PermissionService } from './permission.service'

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), UserModule],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}

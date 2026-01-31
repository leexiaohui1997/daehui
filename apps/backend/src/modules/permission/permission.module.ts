import { Module } from '@nestjs/common'

import { TypeOrmExModule } from '../../common/database/typeorm-ex.module'
import { Permission } from '../../entities/permission/permission.entity'
import { PermissionController } from './permission.controller'
import { PermissionService } from './permission.service'

@Module({
  imports: [TypeOrmExModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}

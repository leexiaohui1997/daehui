import { Module } from '@nestjs/common'

import { TypeOrmExModule } from '../../common/database/typeorm-ex.module'
import { Permission } from '../../entities/permission/permission.entity'
import { PermissionMenu } from '../../entities/permission-menu/permission-menu.entity'
import { PermissionMenuController } from './permission-menu.controller'
import { PermissionMenuService } from './permission-menu.service'

@Module({
  imports: [TypeOrmExModule.forFeature([PermissionMenu, Permission])],
  controllers: [PermissionMenuController],
  providers: [PermissionMenuService],
  exports: [PermissionMenuService],
})
export class PermissionMenuModule {}

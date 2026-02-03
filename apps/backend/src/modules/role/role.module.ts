import { Module } from '@nestjs/common'

import { TypeOrmExModule } from '../../common/database/typeorm-ex.module'
import { PermissionMenu } from '../../entities/permission-menu/permission-menu.entity'
import { Role } from '../../entities/role/role.entity'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'

@Module({
  imports: [TypeOrmExModule.forFeature([Role, PermissionMenu])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}

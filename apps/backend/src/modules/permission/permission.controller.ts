import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'

import { AdminGuard } from '../../common/guards/admin.guard'
import { AuthGuard } from '../../common/guards/auth.guard'
import { Permission } from '../../entities/permission/permission.entity'
import { DeletePermissionDto } from './dto/batch-delete-permission.dto'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { PermissionQueryDto } from './dto/permission-query.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { PermissionService } from './permission.service'

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * 获取权限详情
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Permission> {
    return this.permissionService.findOne(id)
  }

  /**
   * 分页获取权限列表
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  async findList(
    @Body() dto: PermissionQueryDto,
  ): Promise<{ list: Permission[]; total: number }> {
    return this.permissionService.findList(dto)
  }

  /**
   * 创建权限
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Put()
  async create(@Body() dto: CreatePermissionDto): Promise<number> {
    return this.permissionService.create(dto)
  }

  /**
   * 更新权限
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePermissionDto,
  ): Promise<void> {
    return this.permissionService.update(id, dto)
  }

  /**
   * 删除权限
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Delete()
  async delete(@Body() dto: DeletePermissionDto): Promise<void> {
    return this.permissionService.delete(dto)
  }
}

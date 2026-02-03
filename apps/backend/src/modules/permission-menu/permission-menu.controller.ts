import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import { AdminGuard } from '../../common/guards/admin.guard'
import { AuthGuard } from '../../common/guards/auth.guard'
import { PermissionMenu } from '../../entities/permission-menu/permission-menu.entity'
import { BatchDeletePermissionMenuDto } from './dto/batch-delete-permission-menu.dto'
import { CreatePermissionMenuDto } from './dto/create-permission-menu.dto'
import { PermissionMenuQueryDto } from './dto/permission-menu-query.dto'
import { UpdatePermissionMenuDto } from './dto/update-permission-menu.dto'
import { PermissionMenuService } from './permission-menu.service'

@Controller('permission-menus')
@UseInterceptors(ClassSerializerInterceptor)
export class PermissionMenuController {
  constructor(private readonly permissionMenuService: PermissionMenuService) {}

  /**
   * 获取权限菜单详情
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PermissionMenu> {
    return this.permissionMenuService.findOne(id)
  }

  /**
   * 分页获取权限菜单列表
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  async findList(
    @Body() dto: PermissionMenuQueryDto,
  ): Promise<{ list: PermissionMenu[]; total: number }> {
    return this.permissionMenuService.findList(dto)
  }

  /**
   * 创建权限菜单
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Put()
  async create(@Body() dto: CreatePermissionMenuDto): Promise<number> {
    return this.permissionMenuService.create(dto)
  }

  /**
   * 更新权限菜单
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePermissionMenuDto,
  ): Promise<void> {
    return this.permissionMenuService.update(id, dto)
  }

  /**
   * 批量删除权限菜单
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Post('delete')
  async delete(@Body() dto: BatchDeletePermissionMenuDto): Promise<void> {
    return this.permissionMenuService.delete(dto)
  }
}

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
import { Role } from '../../entities/role/role.entity'
import { DeleteRoleDto } from './dto/batch-delete-role.dto'
import { CreateRoleDto } from './dto/create-role.dto'
import { RoleQueryDto } from './dto/role-query.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RoleService } from './role.service'

@Controller('roles')
@UseInterceptors(ClassSerializerInterceptor)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * 获取角色详情
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Role> {
    return this.roleService.findOne(id)
  }

  /**
   * 分页获取角色列表
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  async findList(
    @Body() dto: RoleQueryDto,
  ): Promise<{ list: Role[]; total: number }> {
    return this.roleService.findList(dto)
  }

  /**
   * 创建角色
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Put()
  async create(@Body() dto: CreateRoleDto): Promise<number> {
    return this.roleService.create(dto)
  }

  /**
   * 更新角色
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateRoleDto,
  ): Promise<void> {
    return this.roleService.update(id, dto)
  }

  /**
   * 删除角色
   */
  @UseGuards(AuthGuard, AdminGuard)
  @Post('delete')
  async delete(@Body() dto: DeleteRoleDto): Promise<void> {
    return this.roleService.delete(dto)
  }
}

import { ApiCode, ApiError } from '@daehui/shared'
import { Injectable } from '@nestjs/common'
import { In } from 'typeorm'

import { BaseRepository } from '../../common/database/base.repository'
import { InjectBaseRepository } from '../../common/database/base-repository.decorator'
import { Permission } from '../../entities/permission/permission.entity'
import { PermissionMenu } from '../../entities/permission-menu/permission-menu.entity'
import { BatchDeletePermissionMenuDto } from './dto/batch-delete-permission-menu.dto'
import { CreatePermissionMenuDto } from './dto/create-permission-menu.dto'
import { PermissionMenuQueryDto } from './dto/permission-menu-query.dto'
import { UpdatePermissionMenuDto } from './dto/update-permission-menu.dto'

@Injectable()
export class PermissionMenuService {
  constructor(
    @InjectBaseRepository(PermissionMenu)
    private readonly permissionMenuRepository: BaseRepository<PermissionMenu>,
    @InjectBaseRepository(Permission)
    private readonly permissionRepository: BaseRepository<Permission>,
  ) {}

  /**
   * 根据ID查询权限菜单详情
   * @param id 菜单ID
   */
  async findOne(id: number): Promise<PermissionMenu> {
    const menu = await this.permissionMenuRepository.findOne({
      where: { id },
      relations: ['permissions'],
    })

    if (!menu) {
      throw new ApiError(ApiCode.PARAM_ERROR, '权限菜单不存在')
    }

    return menu
  }

  /**
   * 分页查询权限菜单列表
   * @param dto 查询参数
   */
  async findList(
    dto: PermissionMenuQueryDto,
  ): Promise<{ list: PermissionMenu[]; total: number }> {
    return this.permissionMenuRepository.findListByDto(dto)
  }

  /**
   * 创建权限菜单
   * @param dto 创建参数
   */
  async create(dto: CreatePermissionMenuDto): Promise<number> {
    const { name, title, description, permissionIds } = dto

    // 检查标识是否已存在
    const exists = await this.permissionMenuRepository.findOne({
      where: { name },
    })

    if (exists) {
      throw new ApiError(ApiCode.PARAM_ERROR, '权限菜单标识已存在')
    }

    const permissions = await this.resolvePermissions(permissionIds)

    const menu = this.permissionMenuRepository.create({
      name,
      title,
      description,
      permissions,
    })

    await this.permissionMenuRepository.save(menu)

    return menu.id
  }

  /**
   * 更新权限菜单
   * @param id 菜单ID
   * @param dto 更新参数
   */
  async update(id: number, dto: UpdatePermissionMenuDto): Promise<void> {
    const menu = await this.permissionMenuRepository.findOne({
      where: { id },
    })

    if (!menu) {
      throw new ApiError(ApiCode.PARAM_ERROR, '权限菜单不存在')
    }

    const { title, description, permissionIds } = dto

    if (title !== undefined) menu.title = title
    if (description !== undefined) menu.description = description

    if (permissionIds !== undefined) {
      menu.permissions = await this.resolvePermissions(permissionIds)
    }

    await this.permissionMenuRepository.save(menu)
  }

  /**
   * 批量删除权限菜单
   * @param dto 批量删除参数
   */
  async delete(dto: BatchDeletePermissionMenuDto): Promise<void> {
    const { ids } = dto
    const result = await this.permissionMenuRepository.delete({
      id: In(ids),
    })

    if (result.affected === 0) {
      throw new ApiError(ApiCode.PARAM_ERROR, '所选权限菜单不存在')
    }
  }

  /**
   * 解析并检查权限ID列表
   * @param permissionIds 权限ID列表
   */
  private async resolvePermissions(
    permissionIds?: number[],
  ): Promise<Permission[]> {
    if (!permissionIds || permissionIds.length === 0) {
      return []
    }

    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    })

    if (permissions.length !== permissionIds.length) {
      throw new ApiError(ApiCode.PARAM_ERROR, '部分关联权限不存在')
    }

    return permissions
  }
}

import { ApiCode, ApiError } from '@daehui/shared'
import { Injectable } from '@nestjs/common'
import { In, Like } from 'typeorm'

import { BaseRepository } from '../../common/database/base.repository'
import { InjectBaseRepository } from '../../common/database/base-repository.decorator'
import { Permission } from '../../entities/permission/permission.entity'
import { DeletePermissionDto } from './dto/batch-delete-permission.dto'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { PermissionQueryDto } from './dto/permission-query.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'

@Injectable()
export class PermissionService {
  constructor(
    @InjectBaseRepository(Permission)
    private readonly permissionRepository: BaseRepository<Permission>,
  ) {}

  /**
   * 根据ID查询权限
   * @param id 权限ID
   */
  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    })

    if (!permission) {
      throw new ApiError(ApiCode.PARAM_ERROR, '权限不存在')
    }

    return permission
  }

  /**
   * 分页查询权限列表
   * @param query 查询参数
   */
  async findList(
    query: PermissionQueryDto,
  ): Promise<{ list: Permission[]; total: number }> {
    const { page = 1, pageSize = 10 } = query

    const [list, total] = await this.permissionRepository.findAndCount({
      where: {},
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return { list, total }
  }

  /**
   * 创建权限
   * @param dto 创建权限参数
   */
  async create(dto: CreatePermissionDto): Promise<number> {
    const { name, title, description } = dto

    // 检查权限标识是否已存在
    const exists = await this.permissionRepository.findOne({
      where: { name },
    })

    if (exists) {
      throw new ApiError(ApiCode.PERMISSION_ALREADY_EXISTS)
    }

    const permission = this.permissionRepository.create({
      name,
      title,
      description,
    })

    await this.permissionRepository.save(permission)

    return permission.id
  }

  /**
   * 更新权限
   * @param id 权限ID
   * @param dto 更新参数
   */
  async update(id: number, dto: UpdatePermissionDto): Promise<void> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    })

    if (!permission) {
      throw new ApiError(ApiCode.PARAM_ERROR, '权限不存在')
    }

    Object.assign(permission, dto)

    await this.permissionRepository.save(permission)
  }

  /**
   * 批量删除权限
   * @param dto 批量删除参数
   */
  async delete(dto: DeletePermissionDto): Promise<void> {
    const { ids } = dto
    const result = await this.permissionRepository.delete({
      id: In(ids),
    })

    if (result.affected === 0) {
      throw new ApiError(ApiCode.PARAM_ERROR, '所选权限不存在')
    }
  }
}

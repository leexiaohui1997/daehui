import { ApiCode, ApiError } from '@daehui/shared'
import { Injectable } from '@nestjs/common'
import { In } from 'typeorm'

import { BaseRepository } from '../../common/database/base.repository'
import { InjectBaseRepository } from '../../common/database/base-repository.decorator'
import { PermissionMenu } from '../../entities/permission-menu/permission-menu.entity'
import { Role } from '../../entities/role/role.entity'
import { DeleteRoleDto } from './dto/batch-delete-role.dto'
import { CreateRoleDto } from './dto/create-role.dto'
import { RoleQueryDto } from './dto/role-query.dto'
import { UpdateRoleDto } from './dto/update-role.dto'

@Injectable()
export class RoleService {
  constructor(
    @InjectBaseRepository(Role)
    private readonly roleRepository: BaseRepository<Role>,
    @InjectBaseRepository(PermissionMenu)
    private readonly permissionMenuRepository: BaseRepository<PermissionMenu>,
  ) {}

  /**
   * 根据ID查询角色
   * @param id 角色ID
   */
  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissionMenus'],
    })

    if (!role) {
      throw new ApiError(ApiCode.PARAM_ERROR, '角色不存在')
    }

    return role
  }

  /**
   * 分页查询角色列表
   * @param dto 查询参数
   */
  async findList(dto: RoleQueryDto): Promise<{ list: Role[]; total: number }> {
    return this.roleRepository.findListByDto(dto, {
      relations: ['permissionMenus'],
    })
  }

  /**
   * 创建角色
   * @param dto 创建角色参数
   */
  async create(dto: CreateRoleDto): Promise<number> {
    const { name, title, description, permissionMenuIds } = dto

    // 检查角色标识是否已存在
    const exists = await this.roleRepository.findOne({
      where: { name },
    })

    if (exists) {
      throw new ApiError(ApiCode.PARAM_ERROR, '角色标识已存在')
    }

    const role = this.roleRepository.create({
      name,
      title,
      description,
    })

    if (permissionMenuIds && permissionMenuIds.length > 0) {
      const menus = await this.permissionMenuRepository.findBy({
        id: In(permissionMenuIds),
      })
      role.permissionMenus = menus
    }

    await this.roleRepository.save(role)

    return role.id
  }

  /**
   * 更新角色
   * @param id 角色ID
   * @param dto 更新参数
   */
  async update(id: number, dto: UpdateRoleDto): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id },
    })

    if (!role) {
      throw new ApiError(ApiCode.PARAM_ERROR, '角色不存在')
    }

    const { permissionMenuIds, ...others } = dto

    Object.assign(role, others)

    if (permissionMenuIds) {
      const menus = await this.permissionMenuRepository.findBy({
        id: In(permissionMenuIds),
      })
      role.permissionMenus = menus
    }

    await this.roleRepository.save(role)
  }

  /**
   * 批量删除角色
   * @param dto 批量删除参数
   */
  async delete(dto: DeleteRoleDto): Promise<void> {
    const { ids } = dto
    const result = await this.roleRepository.delete({
      id: In(ids),
    })

    if (result.affected === 0) {
      throw new ApiError(ApiCode.PARAM_ERROR, '所选角色不存在')
    }
  }
}

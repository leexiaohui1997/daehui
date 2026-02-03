import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'

export class UpdateRoleDto {
  /**
   * 角色名称
   */
  @IsString()
  @IsOptional()
  title?: string

  /**
   * 角色描述
   */
  @IsString()
  @IsOptional()
  description?: string

  /**
   * 关联的权限菜单ID列表
   */
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  permissionMenuIds?: number[]
}

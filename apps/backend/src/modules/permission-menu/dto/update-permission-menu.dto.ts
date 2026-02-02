import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'

export class UpdatePermissionMenuDto {
  /**
   * 菜单名称
   */
  @IsString()
  @IsOptional()
  title?: string

  /**
   * 菜单描述
   */
  @IsString()
  @IsOptional()
  description?: string

  /**
   * 关联权限ID列表
   */
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  permissionIds?: number[]
}

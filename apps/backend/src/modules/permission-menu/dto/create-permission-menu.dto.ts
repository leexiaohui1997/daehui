import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator'

export class CreatePermissionMenuDto {
  /**
   * 菜单标识
   * @example 'system:user'
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_:-]+$/, {
    message: '菜单标识只能包含英文、数字、下划线、中划线和冒号',
  })
  name: string

  /**
   * 菜单名称
   * @example '用户管理'
   */
  @IsString()
  @IsNotEmpty()
  title: string

  /**
   * 菜单描述
   * @example '用户管理菜单'
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

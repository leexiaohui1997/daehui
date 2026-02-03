import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator'

export class CreateRoleDto {
  /**
   * 角色标识
   * @example 'admin'
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: '角色标识只能包含英文、数字和下划线',
  })
  name: string

  /**
   * 角色名称
   * @example '管理员'
   */
  @IsString()
  @IsNotEmpty()
  title: string

  /**
   * 角色描述
   * @example '系统管理员，拥有所有权限'
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

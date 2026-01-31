import { IsOptional, IsString } from 'class-validator'

export class UpdatePermissionDto {
  /**
   * 权限名称
   * @example '修改用户'
   */
  @IsString()
  @IsOptional()
  title?: string

  /**
   * 权限描述
   * @example '允许修改现有用户信息'
   */
  @IsString()
  @IsOptional()
  description?: string
}

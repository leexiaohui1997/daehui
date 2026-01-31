import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

export class CreatePermissionDto {
  /**
   * 权限标识
   * @example 'user:create'
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_:]+$/, {
    message: '权限标识只能包含英文、数字、下划线和冒号',
  })
  name: string

  /**
   * 权限名称
   * @example '创建用户'
   */
  @IsString()
  @IsNotEmpty()
  title: string

  /**
   * 权限描述
   * @example '允许创建新用户'
   */
  @IsString()
  @IsOptional()
  description?: string
}

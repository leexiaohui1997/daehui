import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator'

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, { message: '权限标识只能包含英文、数字和下划线' })
  name: string

  @IsString()
  @IsNotEmpty()
  title: string

  @IsInt()
  @IsOptional()
  parentId?: number
}

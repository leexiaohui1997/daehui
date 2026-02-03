import { IsArray, IsInt, IsNotEmpty } from 'class-validator'

export class DeleteRoleDto {
  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  ids: number[]
}

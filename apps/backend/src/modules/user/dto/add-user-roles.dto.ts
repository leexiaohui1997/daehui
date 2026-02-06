import { IsArray, IsInt, IsNotEmpty, Min } from 'class-validator'

export class AddUserRolesDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  userId: number

  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @IsNotEmpty()
  roleIds: number[]
}

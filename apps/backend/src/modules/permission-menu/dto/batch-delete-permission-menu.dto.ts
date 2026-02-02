import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator'

export class BatchDeletePermissionMenuDto {
  /**
   * 菜单ID列表
   * @example [1, 2, 3]
   */
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true, message: '每个ID必须是数字' })
  ids: number[]
}

import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class PaginationDto {
  /**
   * 当前页码
   * @default 1
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1

  /**
   * 每页条数
   * @default 10
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  pageSize?: number = 10

  /**
   * 跳过的条数
   */
  get skip(): number {
    const { page = 1, pageSize = 10 } = this
    return (page - 1) * pageSize
  }
}

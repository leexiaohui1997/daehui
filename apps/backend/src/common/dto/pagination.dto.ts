import { SortOrderValue } from '@daehui/shared'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'

/**
 * 排序配置
 */
export class SortDto {
  /**
   * 排序字段
   */
  @IsString()
  field: string

  /**
   * 排序方向
   */
  @IsIn(['asc', 'desc'])
  order: SortOrderValue
}

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
   * 排序配置
   * @default []
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortDto)
  @IsOptional()
  sort?: SortDto[] = []

  /**
   * 查询条件
   * @default []
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  conditions?: string[] = []

  /**
   * 包含字段
   * @default ''
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  includes?: string[] = []

  /**
   * 跳过的条数
   */
  get skip(): number {
    const { page = 1, pageSize = 10 } = this
    return (page - 1) * pageSize
  }
}

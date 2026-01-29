import { IsOptional, IsString } from 'class-validator'

export class QueryPermissionDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  page?: number

  @IsOptional()
  pageSize?: number

  @IsOptional()
  sortField?: string

  @IsOptional()
  sortOrder?: 'ASC' | 'DESC'
}

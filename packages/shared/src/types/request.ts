export type SortOrderValue = 'asc' | 'desc'

export type PaginationParams = {
  page: number
  pageSize: number
  conditions?: string[]
  sort?: Array<{ field: string; order: SortOrderValue }>
}

export type PaginationResponse<T> = {
  list: T[]
  total: number
}

import type { PaginationParams, PaginationResponse } from '@daehui/shared'

import { requestUtils } from './request'

export type PermissionEntity = {
  id: number
  name: string
  code: string
  description?: string
  createdAt: string
  updatedAt: string
}

class PermissionApi {
  list = requestUtils.defineFunc<
    PaginationParams,
    PaginationResponse<PermissionEntity>
  >('post', '/permissions')
}

export const permissionApi = new PermissionApi()

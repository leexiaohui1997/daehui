import type { PaginationParams, PaginationResponse } from '@daehui/shared'

import { requestUtils } from './request'

export type PermissionEntity = {
  id: number
  name: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
}

class PermissionApi {
  list = requestUtils.defineFunc<
    PaginationParams,
    PaginationResponse<PermissionEntity>
  >('post', '/permissions')

  update = requestUtils.defineFunc<
    Pick<PermissionEntity, 'name' | 'title' | 'description'>,
    void,
    { id: number }
  >('patch', ({ id }) => `/permissions/${id}`)

  create = requestUtils.defineFunc<
    Pick<PermissionEntity, 'name' | 'title' | 'description'>,
    void
  >('put', '/permissions')
}

export const permissionApi = new PermissionApi()

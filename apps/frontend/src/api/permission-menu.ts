import type { PaginationParams, PaginationResponse } from '@daehui/shared'

import { PermissionEntity } from './permission'
import { requestUtils } from './request'

export type PermissionMenuEntity = {
  id: number
  name: string
  title: string
  description?: string
  permissions?: PermissionEntity[]
  permissionIds?: number[]
  createdAt: string
  updatedAt: string
}

class PermissionMenuApi {
  list = requestUtils.defineFunc<
    PaginationParams,
    PaginationResponse<PermissionMenuEntity>
  >('post', '/permission-menus')

  update = requestUtils.defineFunc<
    Pick<PermissionMenuEntity, 'title' | 'description' | 'permissionIds'>,
    void,
    { id: number }
  >('patch', ({ id }) => `/permission-menus/${id}`)

  create = requestUtils.defineFunc<
    Pick<
      PermissionMenuEntity,
      'name' | 'title' | 'description' | 'permissionIds'
    >,
    void
  >('put', '/permission-menus')

  delete = requestUtils.defineFunc<{ ids: number[] }, void>(
    'post',
    '/permission-menus/delete',
  )
}

export const permissionMenuApi = new PermissionMenuApi()

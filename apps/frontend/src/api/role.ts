import type { PaginationParams, PaginationResponse } from '@daehui/shared'

import { PermissionMenuEntity } from './permission-menu'
import { requestUtils } from './request'

export type RoleEntity = {
  id: number
  name: string
  title: string
  description?: string
  permissionMenus?: PermissionMenuEntity[]
  permissionMenuIds?: number[]
  createdAt: string
  updatedAt: string
}

class RoleApi {
  list = requestUtils.defineFunc<
    PaginationParams,
    PaginationResponse<RoleEntity>
  >('post', '/roles')

  update = requestUtils.defineFunc<
    Pick<RoleEntity, 'title' | 'description' | 'permissionMenuIds'>,
    void,
    { id: number }
  >('patch', ({ id }) => `/roles/${id}`)

  create = requestUtils.defineFunc<
    Pick<RoleEntity, 'name' | 'title' | 'description' | 'permissionMenuIds'>,
    void
  >('put', '/roles')

  delete = requestUtils.defineFunc<{ ids: number[] }, void>(
    'post',
    '/roles/delete',
  )
}

export const roleApi = new RoleApi()

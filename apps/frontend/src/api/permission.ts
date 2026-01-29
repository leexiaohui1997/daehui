import { requestUtils } from './request'

export interface Permission {
  id: number
  name: string
  title: string
  parent?: Permission
  children?: Permission[]
  createdAt: string
  updatedAt: string
}

export interface QueryPermissionParams {
  name?: string
  title?: string
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface CreatePermissionParams {
  name: string
  title: string
  parentId?: number
}

const BASE_URL = '/permissions'

export const getPermissionList = requestUtils.defineFunc<
  QueryPermissionParams,
  { items: Permission[]; total: number }
>('get', BASE_URL)

export const createPermission = requestUtils.defineFunc<
  CreatePermissionParams,
  Permission
>('post', BASE_URL)

export const deletePermission = (id: number) => {
  return requestUtils.defineFunc<void, void>('delete', `${BASE_URL}/${id}`)()
}

export const exportPermission = requestUtils.defineFunc<void, Blob>(
  'get',
  `${BASE_URL}/export`,
  undefined,
  { responseType: 'blob' },
)

export const importPermission = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return requestUtils.$axios.post(`${BASE_URL}/import`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

import { PaginationParams, PaginationResponse } from '@daehui/shared'

import { requestUtils } from './request'

export type RspUserInfo = {
  id: number
  username: string
  isAdmin: boolean
}

class UserApi {
  /**
   * 登录
   */
  login = requestUtils.defineFunc<
    { username: string; password: string },
    { token: string }
  >('post', '/user/login')

  /**
   * 注册
   */
  register = requestUtils.defineFunc<
    { username: string; password: string },
    void
  >('post', '/user/register')

  /**
   * 获取当前用户信息
   */
  me = requestUtils.defineFunc<void, RspUserInfo>('get', '/user/me')

  /**
   * 登出
   */
  logout = requestUtils.defineFunc<void, void>('post', '/user/logout')

  /**
   * 获取用户列表
   */
  list = requestUtils.defineFunc<
    PaginationParams,
    PaginationResponse<RspUserInfo>
  >('post', 'user/list')

  /**
   * 给用户添加角色
   */
  addRoles = requestUtils.defineFunc<
    {
      userId: number
      roleIds: number[]
    },
    void
  >('post', '/user/add-roles')
}

export const userApi = new UserApi()

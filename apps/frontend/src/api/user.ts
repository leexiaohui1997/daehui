import { requestUtils } from './request'

export type RspUserInfo = {
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
   * 获取当前用户信息
   */
  me = requestUtils.defineFunc<void, RspUserInfo>('get', '/user/me')
}

export const userApi = new UserApi()

import { requestUtils } from './request'

export type RspUserInfo = {
  username: string
  isAdmin: boolean
}

class UserApi {
  me = requestUtils.defineFunc<void, RspUserInfo>('get', '/user/me')
}

export const userApi = new UserApi()

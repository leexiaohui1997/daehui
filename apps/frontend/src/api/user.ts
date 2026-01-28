import { requestUtils } from './request'

class UserApi {
  me = requestUtils.defineFunc('get', '/user/me')
}

export const userApi = new UserApi()

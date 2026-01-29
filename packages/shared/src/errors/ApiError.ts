export enum ApiCode {
  // 客户端错误码
  PARAM_ERROR = 400,
  UNAUTHORIZED = 401,

  // 服务器错误码
  SERVER_ERROR = 500,

  // 业务错误码
  USER_ALREADY_EXISTS = 10001,
  LOGIN_FAILED = 10002,
}

export const API_ERROR_MAP: Record<ApiCode, string> = {
  [ApiCode.PARAM_ERROR]: '参数错误',
  [ApiCode.UNAUTHORIZED]: '未登录或登录已过期',

  [ApiCode.SERVER_ERROR]: '服务器繁忙',

  [ApiCode.USER_ALREADY_EXISTS]: '用户已存在',
  [ApiCode.LOGIN_FAILED]: '用户名或密码错误',
}

export class ApiError extends Error {
  constructor(
    public code: ApiCode = ApiCode.SERVER_ERROR,
    msg = API_ERROR_MAP[code],
  ) {
    super(msg)
  }
}

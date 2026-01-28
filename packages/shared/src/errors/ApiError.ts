export enum ApiCode {
  SERVER_ERROR = 500,
}

export const API_ERROR_MAP: Record<ApiCode, string> = {
  [ApiCode.SERVER_ERROR]: '服务器繁忙',
}

export class ApiError extends Error {
  constructor(public code: ApiCode = ApiCode.SERVER_ERROR) {
    super(API_ERROR_MAP[code])
  }
}

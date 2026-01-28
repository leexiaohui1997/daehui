import axios, {
  type AxiosHeaders,
  type AxiosInstance,
  type CreateAxiosDefaults,
} from 'axios'

import { ApiCode, ApiError } from '../errors/ApiError'

export type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

export interface RequestUtilsOptions {
  axiosConfig?: CreateAxiosDefaults
}

export class RequestUtils {
  public $axios: AxiosInstance

  constructor(public $options: RequestUtilsOptions) {
    this.$axios = axios.create($options.axiosConfig)
    this.$axios.interceptors.response.use(res => {
      const { code, msg, data } = res.data
      if (code !== 0) {
        if (ApiCode[code]) {
          throw new ApiError(code)
        }

        throw new Error(msg)
      }

      return data
    })
  }

  defineFunc<D = void, R = void>(
    method: RequestMethod,
    url: string,
    headers?: AxiosHeaders,
  ) {
    return (data: D): Promise<R> => {
      return this.$axios[method](url, {
        params: {
          ...(method === 'get' ? data : {}),
        },
        data: {
          ...(method !== 'get' ? data : {}),
        },
        headers: {
          ...headers,
        },
      })
    }
  }
}

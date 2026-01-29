import axios, {
  type AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
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
      // 如果是二进制数据，直接返回
      if (['blob', 'arraybuffer'].includes(res.config.responseType as string)) {
        return res.data
      }

      const { code, msg, data } = res.data
      if (code !== 0) {
        if (ApiCode[code]) {
          throw new ApiError(code, msg)
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
    config?: AxiosRequestConfig,
  ) {
    return (data: D): Promise<R> => {
      if (method === 'get') {
        return this.$axios[method](url, {
          params: {
            ...(method === 'get' ? data : {}),
          },
          headers: {
            ...headers,
          },
          ...config,
        })
      }

      return this.$axios[method](
        url,
        {
          ...(data || {}),
        },
        {
          headers: {
            ...headers,
          },
          ...config,
        },
      )
    }
  }
}

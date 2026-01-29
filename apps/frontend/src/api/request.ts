import { RequestUtils } from '@daehui/shared'

export const requestUtils = new RequestUtils({
  axiosConfig: {
    baseURL: import.meta.env.VITE_API_BASE_URL,
  },
})

// 请求拦截器：自动注入 Token
requestUtils.$axios.interceptors.request.use(config => {
  const token = localStorage.getItem('auth-token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

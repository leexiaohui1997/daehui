import { ApiCode, ApiError, RequestUtils } from '@daehui/shared'

import router from '@/router'
import { useUserStore } from '@/stores/user'

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

// 响应拦截器：处理鉴权错误
requestUtils.$axios.interceptors.response.use(
  res => res,
  async error => {
    if (error instanceof ApiError) {
      const { code } = error
      const userStore = useUserStore()
      const currentRoute = router.currentRoute.value

      // 1. 处理 401（未登录）
      if (code === ApiCode.UNAUTHORIZED) {
        userStore.clear()
        if (currentRoute.meta.requiresAuth) {
          router.replace({
            name: 'Login',
            query: { redirect: currentRoute.fullPath },
          })
        }
      }

      // 2. 处理 403（无权限）
      if (code === ApiCode.FORBIDDEN) {
        if (currentRoute.meta.requiresAdmin) {
          router.replace({ name: 'Forbidden' })
        }
        // 刷新用户信息以获取最新权限状态
        await userStore.fetchUserInfo()
      }
    }
    return Promise.reject(error)
  },
)

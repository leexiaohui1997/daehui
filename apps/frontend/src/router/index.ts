import { createRouter, createWebHashHistory } from 'vue-router'

import { useUserStore } from '@/stores/user'

import { routes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore()

  // 1. 处理 guestOnly 路由（如登录页）
  if (to.meta.guestOnly && userStore.token) {
    return next({ path: '/' })
  }

  // 2. 处理需要鉴权的路由
  if (to.meta.requiresAuth) {
    // 无 Token，重定向到登录
    if (!userStore.token) {
      return next({
        name: 'Login',
        query: { redirect: to.fullPath },
      })
    }

    // 有 Token 但无用户信息，尝试拉取
    if (!userStore.userInfo) {
      try {
        await userStore.fetchUserInfo()
      } catch {
        // 拉取失败（如 Token 过期），清理登录态并重定向
        userStore.clear()
        return next({
          name: 'Login',
          query: { redirect: to.fullPath },
        })
      }
    }

    // 3. 验证管理员权限
    if (to.meta.requiresAdmin && !userStore.userInfo?.isAdmin) {
      return next({ name: 'Forbidden' })
    }
  }

  next()
})

export default router

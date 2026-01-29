import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 是否需要登录鉴权 */
    requiresAuth?: boolean
    /** 是否只允许未登录用户访问（如登录页） */
    guestOnly?: boolean
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/UserLogin.vue'),
        meta: { guestOnly: true },
      },
    ],
  },
]

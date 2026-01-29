import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 是否需要登录鉴权 */
    requiresAuth?: boolean
    /** 是否只允许未登录用户访问（如登录页） */
    guestOnly?: boolean
    /** 是否需要管理员权限 */
    requiresAdmin?: boolean
    /** 所属菜单项的 name */
    belongMenu?: string
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, belongMenu: 'UserList' },
    children: [],
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('@/views/ExceptionForbidden.vue'),
  },
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/UserLogin.vue'),
        meta: { guestOnly: true },
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/UserRegister.vue'),
        meta: { guestOnly: true },
      },
    ],
  },
]

import type { RouteRecordRaw } from 'vue-router'

import { MenuType } from '@/constants/menu'

export const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      menuType: MenuType.Admin,
    },
    children: [
      {
        path: 'permission',
        name: 'PermissionConfig',
        component: () => import('@/views/system/PermissionConfig.vue'),
        meta: { title: '权限配置' },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: { guestOnly: true },
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/UserLogin.vue'),
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/UserRegister.vue'),
      },
    ],
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('@/views/ExceptionForbidden.vue'),
  },
]

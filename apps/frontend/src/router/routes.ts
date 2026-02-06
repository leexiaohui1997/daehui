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
        name: 'PermissionList',
        component: () => import('@/views/permission/PermissionList.vue'),
        meta: {
          belongMenu: 'auth-config',
        },
      },
      {
        path: 'permission-menu',
        name: 'PermissionMenuList',
        component: () => import('@/views/permission/PermissionMenuList.vue'),
        meta: {
          belongMenu: 'menu-config',
        },
      },
      {
        path: 'role',
        name: 'RoleList',
        component: () => import('@/views/permission/RoleList.vue'),
        meta: {
          belongMenu: 'role-config',
        },
      },
      {
        path: 'role/user',
        name: 'RoleUserList',
        component: () => import('@/views/permission/UserList.vue'),
        meta: {
          belongMenu: 'user-config',
        },
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

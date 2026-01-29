import 'vue-router'

import type { MenuType } from '@/constants/menu'

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
    /** 菜单类型 */
    menuType?: MenuType
  }
}

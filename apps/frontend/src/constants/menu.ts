export type MenuItemRaw = {
  icon?: string
  name: string
  title: string
  path?: string
  children?: MenuItemRaw[]
}

export enum MenuType {
  // 管理后台
  Admin = 'admin',
}

export const MENU_CONFIGS: Record<MenuType, MenuItemRaw[]> = {
  [MenuType.Admin]: [
    {
      icon: 'icon-safe',
      name: 'auth',
      title: '权限',
      children: [
        {
          title: '菜单配置',
          name: 'menu-config',
          path: '/admin/permission-menu',
        },
        {
          title: '权限配置',
          name: 'auth-config',
          path: '/admin/permission',
        },
        {
          title: '角色配置',
          name: 'role-config',
          path: '/admin/role',
        },
        {
          title: '用户配置',
          name: 'user-config',
          path: '/admin/role/user',
        },
      ],
    },
  ],
}

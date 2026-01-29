export type MenuItemRaw = {
  icon?: string
  name: string
  title: string
  path?: string
  children?: MenuItemRaw[]
}

export enum MenuType {
  Admin = 'admin',
}

export const MENU_CONFIGS: Record<MenuType, MenuItemRaw[]> = {
  [MenuType.Admin]: [],
}

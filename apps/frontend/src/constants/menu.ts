export type MenuItemRaw = {
  icon?: string
  name: string
  title: string
  path?: string
  children?: MenuItemRaw[]
}

export const ADMIN_MENU: MenuItemRaw[] = []

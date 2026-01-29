<template>
  <a-menu
    :selected-keys="[active]"
    auto-open-selected
    style="width: 100%; height: 100%"
    @menu-item-click="handleMenuItemClick">
    <AsideMenuItem v-for="item in menuItems" :key="item.name" :item="item" />
  </a-menu>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import type { MenuItemRaw } from '@/constants/menu'

import AsideMenuItem from './AsideMenuItem.vue'

const props = defineProps<{
  menuItems: MenuItemRaw[]
  active: string
}>()

const router = useRouter()

/**
 * 递归查找菜单项
 */
const findMenuItem = (
  items: MenuItemRaw[],
  name: string,
): MenuItemRaw | undefined => {
  for (const item of items) {
    if (item.name === name) return item
    if (item.children) {
      const found = findMenuItem(item.children, name)
      if (found) return found
    }
  }
}

/**
 * 菜单项点击跳转
 */
const handleMenuItemClick = (name: string) => {
  const item = findMenuItem(props.menuItems, name)
  if (!item) return

  if (item.path) {
    router.push(item.path)
  }
}
</script>

<style scoped lang="less"></style>

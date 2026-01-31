<template>
  <div class="site-aside">
    <div class="site-aside-left">
      <div
        v-for="item in menu"
        :key="item.name"
        :class="{ 'menu-root': true, active: item === activeMenuRoot }"
        @click="handleClickRoot(item)">
        <component :is="item.icon" />
        <div class="menu-root-name">{{ item.title }}</div>
      </div>
    </div>
    <div class="site-aside-main">
      <AsideMenu
        :menu-items="activeMenuRoot?.children || []"
        :active="activeMenu" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { deepFind } from '@daehui/shared'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { MENU_CONFIGS, type MenuItemRaw } from '@/constants/menu'

import AsideMenu from './AsideMenu.vue'

const route = useRoute()
const router = useRouter()

const menu = computed(() =>
  route.meta.menuType ? MENU_CONFIGS[route.meta.menuType] : [],
)

const activeMenu = computed(
  () => (route.meta.belongMenu as string) || (route.name as string),
)
const activeMenuRoot = computed(
  () =>
    menu.value.find(rootItem =>
      deepFind(rootItem.children || [], item => item.name === activeMenu.value),
    ) || menu.value[0],
)

const handleClickRoot = (item: MenuItemRaw) => {
  if (item === activeMenuRoot.value) return
  const first = deepFind(item.children || [], child => !!child.path)
  if (first) {
    router.push(first.path!)
  }
}
</script>

<style scoped lang="less">
@menu-root-size: 56px;

.site-aside {
  --color-menu-light-bg: var(--color-bg-1);
  width: 260px;
  background-color: var(--color-bg-2);
  display: flex;

  &-left {
    width: @menu-root-size;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: @size-2;
  }

  &-main {
    flex: 1;
    border-radius: @border-radius-large;
    overflow: auto;
  }
}

.menu-root {
  width: @menu-root-size;
  height: @menu-root-size;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: @size-2;
  cursor: pointer;
  color: @color-text-3;
  transition: color 0.2s;

  &:hover {
    color: @color-text-1;
  }

  &.active {
    color: @primary-6;
  }

  &-name {
    font-size: @font-size-body-1;
  }
}
</style>

<template>
  <div class="site-aside">
    <AsideMenu :menu-items="ADMIN_MENU" :active="activeMenu" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { ADMIN_MENU } from '@/constants/menu'

import AsideMenu from './AsideMenu.vue'

const route = useRoute()

const activeMenu = computed(
  () => (route.meta.belongMenu as string) || (route.name as string),
)
</script>

<style scoped lang="less">
.site-aside {
  width: 260px;
  background-color: var(--color-bg-1);
  border-right: 1px solid var(--color-border-2);
}
</style>

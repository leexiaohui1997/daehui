<template>
  <template v-if="item.children && item.children.length">
    <a-sub-menu :key="item.name">
      <template v-if="item.icon" #icon>
        <component :is="item.icon" />
      </template>
      <template #title>{{ item.title }}</template>
      <AsideMenuItem
        v-for="child in item.children"
        :key="child.name"
        :item="child" />
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item :key="item.name">
      <template v-if="item.icon" #icon>
        <component :is="item.icon" />
      </template>
      {{ item.title }}
    </a-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { MenuItemRaw } from '@/constants/menu'

defineProps<{
  item: MenuItemRaw
}>()
</script>

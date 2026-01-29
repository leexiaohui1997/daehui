<template>
  <a-dropdown trigger="hover" position="bottom">
    <a-button type="text">
      <template #icon>
        <component :is="currentIcon" />
      </template>
    </a-button>
    <template #content>
      <a-doption @click="handleSelect('light')">
        <div class="option">
          <icon-sun-fill class="option-icon" />
          <span>亮色模式</span>
        </div>
      </a-doption>
      <a-doption @click="handleSelect('dark')">
        <div class="option">
          <icon-moon-fill class="option-icon" />
          <span>暗黑模式</span>
        </div>
      </a-doption>
      <a-doption @click="handleSelect('system')">
        <div class="option">
          <icon-desktop class="option-icon" />
          <span>跟随系统</span>
        </div>
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useThemeStore } from '@/stores/theme'

type ThemeMode = 'light' | 'dark' | 'system'

const theme = useThemeStore()

/**
 * 计算当前按钮展示的图标
 * 根据主题模式返回对应图标组件名称字符串
 */
const currentIcon = computed(() => {
  const m = theme.mode
  if (m === 'dark') return 'icon-moon-fill'
  if (m === 'system') return 'icon-desktop'
  return 'icon-sun-fill'
})

/**
 * 处理下拉菜单选择事件
 * 根据用户选择更新主题模式并应用到页面
 */
function handleSelect(mode: ThemeMode) {
  theme.setMode(mode)
}
</script>

<style scoped lang="less">
.option {
  display: flex;
  align-items: center;
  gap: @size-2;
}
.option-icon {
  font-size: @font-size-body-3;
}
</style>

<script setup lang="ts">
import SwitchThemeButton from '@/components/SwitchThemeButton.vue'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-layout-right">
      <SwitchThemeButton />
    </div>
    <img src="@/assets/images/logo.png" class="auth-layout-logo" />
    <div class="auth-layout-content">
      <router-view />
    </div>
  </div>
</template>

<style lang="less" scoped>
.auth-layout {
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;

  &-logo {
    display: flex;
    height: 60px;
    padding: @size-30 0 @size-9;
  }

  &-right {
    top: @size-6;
    right: @size-6;
    position: absolute;
    display: flex;
    align-items: center;
    gap: @size-2;
  }
}
</style>

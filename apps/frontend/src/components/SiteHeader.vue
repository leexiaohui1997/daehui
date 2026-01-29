<template>
  <div class="site-header">
    <div class="site-header-left">
      <a href="/" class="site-header-left-logo">
        <img src="@/assets/images/logo.png" alt="logo" />
      </a>
    </div>
    <div class="site-header-right">
      <SwitchThemeButton />
      <NavUser />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavUser from './NavUser.vue'
import SwitchThemeButton from './SwitchThemeButton.vue'
</script>

<style scoped lang="less">
.site-header {
  height: 60px;
  background-color: var(--color-bg-1);
  border-bottom: 1px solid var(--color-border-2);
  display: flex;
  align-items: center;
  justify-content: space-between;

  &-left {
    width: 260px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 @size-6;

    &-logo {
      display: flex;
      img {
        height: 32px;
      }
    }
  }

  &-right {
    display: flex;
    align-items: center;
    padding: 0 @size-6;
    gap: @size-2;
  }
}
</style>

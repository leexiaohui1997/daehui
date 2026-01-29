<template>
  <div class="default-layout">
    <SiteHeader />
    <div class="default-layout-main">
      <SiteAside />
      <div class="default-layout-main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SiteAside from '@/components/SiteAside.vue'
import SiteHeader from '@/components/SiteHeader.vue'
</script>

<style scoped lang="less">
.default-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-1);
}

.default-layout-main {
  flex: 1;
  display: flex;
  gap: 2px;
}

.default-layout-main-content {
  flex: 1;
  width: 0;
  height: 100%;
  background: var(--color-bg-2);
  border-radius: @border-radius-large;
  overflow: auto;
}
</style>

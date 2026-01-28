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
}

.default-layout-main {
  flex: 1;
  display: flex;
}

.default-layout-main-content {
  flex: 1;
}
</style>

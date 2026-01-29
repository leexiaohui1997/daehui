<template>
  <div class="exception-forbidden">
    <a-result status="403" title="权限不足" subtitle="抱歉，您没有权限访问该页面">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="goHome">返回首页</a-button>
          <a-button @click="logout">切换账号</a-button>
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const goHome = () => {
  router.push('/')
}

const logout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="less">
.exception-forbidden {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--color-bg-1);
}
</style>

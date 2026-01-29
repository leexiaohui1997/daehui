<template>
  <div class="nav-user">
    <template v-if="userStore.userInfo">
      <a-dropdown trigger="hover" position="br">
        <div class="user-avatar">
          <a-avatar
            :size="32"
            :style="{ backgroundColor: 'var(--color-primary-light-1)' }">
            {{ userStore.userInfo.username[0]?.toUpperCase() }}
          </a-avatar>
        </div>
        <template #content>
          <div class="user-dropdown-content">
            <div class="user-info">
              <div class="username">{{ userStore.userInfo.username }}</div>
              <a-tag
                v-if="userStore.userInfo.isAdmin"
                size="small"
                color="green">
                <template #icon>
                  <icon-safe />
                </template>
                管理员
              </a-tag>
            </div>
            <a-divider style="margin: 4px 0" />
            <a-doption @click="handleLogout">
              <template #icon>
                <icon-export />
              </template>
              退出登录
            </a-doption>
          </div>
        </template>
      </a-dropdown>
    </template>
    <template v-else>
      <div class="auth-buttons">
        <a-button type="text" @click="handleLogin">登录</a-button>
        <a-button type="primary" @click="handleRegister">注册</a-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Modal } from '@arco-design/web-vue'
import { IconExport } from '@arco-design/web-vue/es/icon'
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogin = () => {
  router.push('/login')
}

const handleRegister = () => {
  // 目前暂未实现注册页面，先预留跳转逻辑
  router.push('/register')
}

const handleLogout = () => {
  Modal.confirm({
    title: '确认退出',
    content: '确定要退出登录吗？',
    okText: '确认',
    cancelText: '取消',
    titleAlign: 'start',
    onOk: async () => {
      await userStore.logout()
      router.push('/login')
    },
  })
}
</script>

<style scoped lang="less">
.nav-user {
  display: flex;
  align-items: center;

  .user-avatar {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 50%;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--color-fill-2);
    }
  }

  .auth-buttons {
    display: flex;
    gap: @size-2;
  }
}

.user-dropdown-content {
  min-width: 200px;

  .user-info {
    padding: @size-2 @size-3;
    display: flex;
    align-items: center;
    gap: @size-2;
  }
}
</style>

<template>
  <a-card class="login-card" :bordered="false">
    <template #title>
      <div class="login-title">用户登录</div>
    </template>
    <a-form :model="form" layout="vertical" @submit="handleSubmit">
      <a-form-item
        field="username"
        label="用户名"
        :rules="[{ required: true, message: '请输入用户名' }]">
        <a-input v-model="form.username" placeholder="请输入用户名">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        label="密码"
        :rules="[{ required: true, message: '请输入密码' }]">
        <a-input-password v-model="form.password" placeholder="请输入密码">
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <div class="login-options">
          <a-checkbox v-model="form.remember">记住账号</a-checkbox>
        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" long :loading="loading">
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { getErrorMsg } from '@daehui/shared'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { userApi } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const REMEMBER_USERNAME_KEY = 'remember-username'

const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
  remember: false,
})

onMounted(() => {
  const savedUsername = localStorage.getItem(REMEMBER_USERNAME_KEY)
  if (savedUsername) {
    form.username = savedUsername
    form.remember = true
  }
})

/**
 * 提交登录表单
 */
const handleSubmit = async ({ errors }: { errors: unknown }) => {
  if (errors) return

  loading.value = true
  try {
    // 1. 调用登录接口
    const res = await userApi.login(form)

    // 2. 存储 Token
    userStore.setToken(res.token)

    // 3. 获取用户信息
    await userStore.fetchUserInfo()

    // 4. 记住账号逻辑
    if (form.remember) {
      localStorage.setItem(REMEMBER_USERNAME_KEY, form.username)
    } else {
      localStorage.removeItem(REMEMBER_USERNAME_KEY)
    }

    Message.success('登录成功')

    // 5. 重定向
    const redirect = route.query.redirect as string
    router.replace(redirect || '/admin')
  } catch (error: unknown) {
    Message.error(getErrorMsg(error))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="less">
.login-card {
  width: 400px;
  box-shadow: @shadow1-center;
  border-radius: @border-radius-large;

  .login-title {
    text-align: center;
    font-size: @font-size-title-1;
    font-weight: @font-weight-500;
  }

  .login-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
}
</style>

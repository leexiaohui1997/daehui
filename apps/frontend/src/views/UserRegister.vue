<template>
  <a-card class="register-card" :bordered="false">
    <template #title>
      <div class="register-title">用户注册</div>
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
        :rules="[
          { required: true, message: '请输入密码' },
          { minLength: 6, message: '密码长度不能少于 6 位' },
        ]">
        <a-input-password v-model="form.password" placeholder="请输入密码">
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        field="confirmPassword"
        label="确认密码"
        :rules="[
          { required: true, message: '请再次输入密码' },
          { validator: validateConfirmPassword },
        ]">
        <a-input-password
          v-model="form.confirmPassword"
          placeholder="请再次输入密码">
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" long :loading="loading">
          注册
        </a-button>
      </a-form-item>

      <div class="register-options">
        <a-link @click="handleGoLogin">已有账号？立即登录</a-link>
      </div>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { getErrorMsg } from '@daehui/shared'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { userApi } from '@/api/user'

const router = useRouter()

const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

/**
 * 校验确认密码
 */
const validateConfirmPassword = (
  value: string | undefined,
  callback: (error?: string) => void,
) => {
  if (value !== form.password) {
    callback('两次输入的密码不一致')
  } else {
    callback()
  }
}

/**
 * 提交注册表单
 */
const handleSubmit = async ({ errors }: { errors: unknown }) => {
  if (errors) return

  loading.value = true
  try {
    await userApi.register({
      username: form.username,
      password: form.password,
    })

    Message.success('注册成功，请登录')
    router.push('/login')
  } catch (error: unknown) {
    Message.error(getErrorMsg(error))
  } finally {
    loading.value = false
  }
}

const handleGoLogin = () => {
  router.push('/login')
}
</script>

<style scoped lang="less">
.register-card {
  width: 400px;
  box-shadow: @shadow1-center;
  border-radius: @border-radius-large;

  .register-title {
    text-align: center;
    font-size: @font-size-title-1;
    font-weight: @font-weight-500;
  }

  .register-options {
    margin-top: 12px;
    text-align: center;
  }
}
</style>

import { defineStore } from 'pinia'
import { ref } from 'vue'

import { type RspUserInfo, userApi } from '../api/user'

const TOKEN_KEY = 'auth-token'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const userInfo = ref<RspUserInfo | null>(null)

  /**
   * 设置 Token 并持久化
   */
  function setToken(newToken: string | null) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  /**
   * 获取用户信息
   */
  async function fetchUserInfo() {
    if (!token.value) return
    try {
      userInfo.value = await userApi.me()
    } catch {
      clear()
    }
  }

  /**
   * 清除用户信息
   */
  function clear() {
    setToken(null)
    userInfo.value = null
  }

  /**
   * 登出逻辑
   */
  async function logout() {
    try {
      await userApi.logout()
    } finally {
      clear()
    }
  }

  return {
    token,
    userInfo,
    setToken,
    fetchUserInfo,
    clear,
    logout,
  }
})

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'app-theme-mode'
const DARK_ATTR = 'arco-theme'

/**
 * 从本地存储读取主题模式
 * 返回值限定为 'light' | 'dark' | 'system' 或 null（无记录/解析失败）
 */
function readStoredMode(): ThemeMode | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY)
    if (val === 'light' || val === 'dark' || val === 'system') return val
    return null
  } catch {
    return null
  }
}

/**
 * 将主题模式写入本地存储
 * 发生异常（例如隐身模式限制）时安全忽略
 */
function writeStoredMode(mode: ThemeMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // ignore
  }
}

/**
 * 获取系统是否偏好暗黑模式
 * 使用浏览器的 matchMedia 查询 prefers-color-scheme
 */
function getSystemPrefersDark(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

/**
 * 根据传入布尔值切换页面暗黑类名
 * 使用 Arco Design 的暗黑类名：arco-theme-dark
 */
function applyDarkClass(enabled: boolean) {
  const el = document.body
  if (enabled) {
    el.setAttribute(DARK_ATTR, 'dark')
  } else {
    el.removeAttribute(DARK_ATTR)
  }
}

/**
 * 使用 setup 风格定义主题 store
 * 提供亮色、暗黑、跟随系统三种模式的管理与应用
 */
export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(readStoredMode() ?? 'system')
  const mql = ref<MediaQueryList | null>(null)

  /**
   * 计算当前是否处于暗黑模式
   * 优先使用用户选择的模式；当为“跟随系统”时依据系统偏好
   */
  const isDark = computed<boolean>(() => {
    if (mode.value === 'dark') return true
    if (mode.value === 'light') return false
    return getSystemPrefersDark()
  })

  /**
   * 初始化主题：读取本地存储、注册系统监听并应用到页面
   */
  function init() {
    mode.value = readStoredMode() ?? 'system'
    setupSystemListener()
    applyTheme()
  }

  /**
   * 设置主题模式：写入本地存储并重新应用到页面
   */
  function setMode(next: ThemeMode) {
    if (mode.value === next) return
    mode.value = next
    writeStoredMode(next)
    setupSystemListener()
    applyTheme()
  }

  /**
   * 应用主题到页面：根据 isDark 结果切换暗黑类名
   */
  function applyTheme() {
    applyDarkClass(isDark.value)
  }

  /**
   * 内部：根据当前模式注册或移除系统主题变化监听
   * 仅当模式为“system”时启用监听
   */
  function setupSystemListener() {
    // 清理旧监听
    if (mql.value) {
      try {
        mql.value.removeEventListener('change', onSystemChange as EventListener)
      } catch {
        // ignore
      }
      mql.value = null
    }
    // 跟随系统时注册监听
    if (mode.value === 'system' && window.matchMedia) {
      mql.value = window.matchMedia('(prefers-color-scheme: dark)')
      mql.value.addEventListener('change', onSystemChange as EventListener)
    }
  }

  /**
   * 内部：系统主题变化回调，触发重新应用主题
   */
  function onSystemChange() {
    applyTheme()
  }

  return {
    mode,
    isDark,
    init,
    setMode,
    applyTheme,
  }
})

import '@arco-design/web-vue/dist/arco.css'
import './assets/less/index.less'

import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'
import { useUserStore } from './stores/user'

async function bootstrap() {
  const app = createApp(App)

  const pinia = createPinia()
  app.use(pinia)
  app.use(router)
  app.use(ArcoVueIcon)

  const theme = useThemeStore()
  theme.init()

  const user = useUserStore()
  await user.fetchUserInfo()

  app.mount('#app')
}

bootstrap()

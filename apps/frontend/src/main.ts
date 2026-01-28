import './assets/less/index.less'

import { createApp } from 'vue'

import App from './App.vue'

async function bootstrap() {
  createApp(App).mount('#app')
}

bootstrap()

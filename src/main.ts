import { createApp } from 'vue'

import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import CronJob from '@vue-js-cron/element-plus'

import { router } from '@/router'
import 'element-plus/dist/index.css'

//import theme
import './theme/index.scss'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'uno.css'

import App from './app.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(CronJob)
app.use(createPinia())
app.use(router)

const response = await fetch(
  `${import.meta.env.BASE_URL}config.${import.meta.env.MODE}.json`
)

const config = (await response.json()) as DAppsConfig

window.__dapps = {
  apiUrl: config.apiUrl
}

app.mount('#app')

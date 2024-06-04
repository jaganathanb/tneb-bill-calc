import { createApp } from 'vue'

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { ModuleRegistry } from '@ag-grid-community/core'
import CronJob from '@vue-js-cron/element-plus'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'

import { router } from '@/router'
import 'element-plus/dist/index.css'

//import theme
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'uno.css'
import './theme/index.scss'

import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-quartz.css'

import App from './app.vue'

ModuleRegistry.registerModules([ClientSideRowModelModule])

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

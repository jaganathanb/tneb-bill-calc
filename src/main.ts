import { createApp } from 'vue'

import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'

import { router } from '@/router'
import 'element-plus/dist/index.css'

//import theme
import './theme/index.scss'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'uno.css'

import App from './app.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')

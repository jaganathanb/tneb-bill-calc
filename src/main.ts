import { connectAuthEmulator } from 'firebase/auth'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { VueFire, VueFireAuth, useFirebaseAuth } from 'vuefire'
import App from './App.vue'
import { firebaseInit } from './firebase.app'
import { router } from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(VueFire, {
  firebaseApp: firebaseInit(),
  modules: [VueFireAuth()]
})

if (location.hostname === 'localhost') {
  connectAuthEmulator(useFirebaseAuth()!, 'http://localhost:9099')
}

app.mount('#app')

import { connectAuthEmulator } from 'firebase/auth'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import {
  VueFire,
  VueFireAuth,
  useFirebaseAuth,
  useFirestore,
  VueFireAppCheck
} from 'vuefire'
import App from './App.vue'
import { firebaseInit } from './firebase.app'
import { router } from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import 'uno.css'
import { connectFirestoreEmulator } from 'firebase/firestore'
import { ReCaptchaV3Provider } from 'firebase/app-check'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(VueFire, {
  firebaseApp: firebaseInit(),
  modules: [
    VueFireAuth(),
    VueFireAppCheck({
      debug: process.env.NODE_ENV !== 'production',
      isTokenAutoRefreshEnabled: true,
      provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHAKEY)
    })
  ]
})

if (location.hostname === 'localhost') {
  connectAuthEmulator(useFirebaseAuth()!, 'http://localhost:9099')
  connectFirestoreEmulator(useFirestore(), 'localhost', 8080)
}

app.mount('#app')

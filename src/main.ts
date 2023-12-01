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
import { firebaseInit } from './firebase.app'
import { router } from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//import theme
import './theme/index.scss'

import 'uno.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import { connectFirestoreEmulator } from 'firebase/firestore'
import { ReCaptchaV3Provider } from 'firebase/app-check'
import App from './app.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.use(VueFire, {
  firebaseApp: firebaseInit(),
  modules: [
    VueFireAuth(),
    VueFireAppCheck({
      isTokenAutoRefreshEnabled: true,
      debug: import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN,
      provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHAKEY)
    })
  ]
})

if (location.hostname === 'localhost') {
  connectAuthEmulator(useFirebaseAuth()!, 'http://localhost:9099')
  connectFirestoreEmulator(useFirestore(), 'localhost', 8080)
}

app.mount('#app')

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type UserCredential
} from 'firebase/auth'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useFirebaseAuth } from 'vuefire'

export type RegistrationForm = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginForm {
  email: string
  password: string
}

interface AuthStore {
  user: UserCredential | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth-store', () => {
  const auth = useFirebaseAuth()! // only exists on client side

  const user: Ref<UserCredential | null> = ref(null)
  const isAuthenticated = ref(false)

  async function signIn({ email, password }: LoginForm) {
    user.value = await signInWithEmailAndPassword(auth, email, password)
    isAuthenticated.value = !!user.value
  }

  async function createUser({ email, password }: RegistrationForm) {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  async function signOut() {
    await auth.signOut()
  }

  return {
    user,
    isAuthenticated,
    signIn,
    createUser,
    signOut
  }
})

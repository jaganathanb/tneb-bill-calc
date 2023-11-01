import { router } from '@/router'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  indexedDBLocalPersistence,
  setPersistence,
  type UserCredential,
  type Unsubscribe,
  type User
} from 'firebase/auth'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'

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

export const useAuthStore = defineStore('authStore', () => {
  const auth = useFirebaseAuth()! // only exists on client side

  async function signIn({ email, password }: LoginForm) {
    await setPersistence(auth, indexedDBLocalPersistence)

    await signInWithEmailAndPassword(auth, email, password)
  }

  async function createUser({ email, password }: RegistrationForm) {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  async function signOut() {
    await auth.signOut()
  }

  return {
    signIn,
    createUser,
    signOut
  }
})

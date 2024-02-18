import { authService } from '@/services'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

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
  user: User | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('authStore', () => {
  const service = authService()
  const currentUser: Ref<User|null> = ref(null)
  const isAuthenticated = ref(false)

  const signIn = async ({ email, password }: LoginForm) => {
    const d = await service.signIn({ email, password })
    currentUser.value = { ...d.data.user, expiresIn: d.data.userCredential.expiresIn } as User

    isAuthenticated.value = d.data?.userCredential?.accessToken !== null
  }

  const signOut = async () => {
    await service.signOut(currentUser.value?.userId as string)
    currentUser.value = null

    isAuthenticated.value = false
  }

 const register = async (data: RegistrationForm): Promise<string> => {
  const r = await service.register(data)

  return r.data ? `${r.data.firstName} ${r.data.lastName}` : ''
 }

  return {
    signIn,
    register,
    signOut,
    currentUser,
    isAuthenticated
  }
})

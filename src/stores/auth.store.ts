import { type Ref, ref } from 'vue'

import { defineStore } from 'pinia'

import { authService } from '@/services'

export type RegistrationForm = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  username: string
}

export interface LoginForm {
  username: string
  password: string
}

export const useAuthStore = defineStore('authStore', () => {
  const service = authService()
  const currentUser: Ref<User | undefined> = ref(undefined)
  const isAuthenticated = ref(false)

  const signIn = async ({ username: email, password }: LoginForm) => {
    const response = await service.signIn({ username: email, password })

    if (response.status === 201) {
      localStorage.setItem(`_token`, btoa(response.data.result.accessToken))

      isAuthenticated.value = response.data.result.accessToken !== undefined
    } else {
      throw new Error('Check form values')
    }
  }

  const signOut = async () => {
    await service.signOut(currentUser.value?.userId as string)
    currentUser.value = undefined
    localStorage.removeItem('_token')
    isAuthenticated.value = false
  }

  const register = async (data: RegistrationForm): Promise<string> => {
    const r = await service.register(data)

    return r.status === 200
      ? `${r.data.result.firstName} ${r.data.result.lastName}`
      : ''
  }

  return {
    signIn,
    register,
    signOut,
    currentUser,
    isAuthenticated
  }
})

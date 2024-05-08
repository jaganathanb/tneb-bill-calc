import { type Ref, ref } from 'vue'

import { acceptHMRUpdate, defineStore } from 'pinia'

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
  const currentUser: Ref<User | undefined> = ref({
    userName: localStorage.getItem('userName')
  } as User)
  const isAuthenticated = ref(
    localStorage.getItem(`${localStorage.getItem('userName')}_token`) !== null
  )

  const signIn = async ({ username: email, password }: LoginForm) => {
    const response = await service.signIn({ username: email, password })

    if (response.status === 201) {
      localStorage.setItem(`userName`, email)
      localStorage.setItem(
        `${email}_token`,
        btoa(response.data.result.accessToken)
      )

      const userResponse = await service.getProfile(email)
      if (userResponse.status === 200) {
        currentUser.value = userResponse.data.result
        localStorage.setItem('user', JSON.stringify(currentUser.value ?? {}))
      }

      isAuthenticated.value = response.data.result.accessToken !== undefined
    } else {
      throw new Error('Check form values')
    }
  }

  const signOut = async () => {
    await service.signOut(currentUser.value?.userName as string)

    localStorage.removeItem(`${currentUser.value?.userName as string}_token`)
    localStorage.removeItem('userName')

    currentUser.value = undefined
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

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}

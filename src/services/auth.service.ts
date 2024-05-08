import { useHttpClient } from '@/hooks'

import type { LoginForm, RegistrationForm } from '@/stores'

export interface AuthService {
  signIn: (data: LoginForm) => Promise<HttpResponse<AuthResult>>
  signOut: (id: string) => Promise<HttpResponse<boolean>>
  register: (data: RegistrationForm) => Promise<HttpResponse<User>>
  refresh: (id: string) => Promise<HttpResponse<AuthResult>>
  getProfile: (userId: string) => Promise<HttpResponse<User>>
}

export default (function () {
  const httpClient = useHttpClient()

  const signIn = (data: LoginForm) => {
    return httpClient.post('/auth/login', data)
  }

  const signOut = (id: string) => {
    return httpClient.post(`/auth/logout`, { username: id })
  }

  const register = (data: RegistrationForm) => {
    return httpClient.post(`/auth/register`, data)
  }

  const refresh = (id: string) => {
    return httpClient.get(`/auth/${id}/refresh`)
  }

  const getProfile = (userId: string) => {
    return httpClient.get(`/auth/${userId}/profile`)
  }

  const instance: AuthService = {
    signIn,
    signOut,
    register,
    refresh,
    getProfile
  }

  return () => {
    return instance
  }
})()

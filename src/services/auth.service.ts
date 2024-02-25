import { useHttpClient } from '@/hooks'

import type { LoginForm, RegistrationForm } from '@/stores'

export interface AuthService {
  signIn: (data: LoginForm) => Promise<HttpResponse<AuthResult>>
  signOut: (id: string) => Promise<HttpResponse<boolean>>
  register: (data: RegistrationForm) => Promise<HttpResponse<User>>
  refresh: (id: string) => Promise<HttpResponse<AuthResult>>
}

export default (function () {
  const httpClient = useHttpClient()

  const signIn = (data: LoginForm) => {
    return httpClient.post('/auth/login', data)
  }

  const signOut = (id: string) => {
    return httpClient.get(`/auth/${id}/logout`)
  }

  const register = (data: RegistrationForm) => {
    return httpClient.post(`/auth/register`, data)
  }

  const refresh = (id: string) => {
    return httpClient.get(`/auth/${id}/refresh`)
  }

  const instance: AuthService = { signIn, signOut, register, refresh }

  return () => {
    return instance
  }
})()

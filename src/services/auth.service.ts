import { useHttpClient } from "@/hooks"
import type { LoginForm, RegistrationForm } from "@/stores"
import type { AxiosResponse } from "axios"

export interface AuthService {
    signIn: (data: LoginForm) => Promise<AxiosResponse<UserDetail, any>>
    signOut: (id: string) => Promise<AxiosResponse<boolean, any>>
    register: (data: RegistrationForm) => Promise<AxiosResponse<User, any>>
    refresh: (id: string) => Promise<AxiosResponse<UserCredential, any>>
}

export default (function () {
    const httpClient = useHttpClient()

    const signIn = (data: LoginForm) => {
        return httpClient.post<UserDetail>('/auth/login', data)
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
  
    let instance: AuthService = { signIn, signOut, register, refresh };
  
    return () => {
      return instance;
    };
  })()
  
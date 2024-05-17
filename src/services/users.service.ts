import { useHttpClient } from '@/hooks/use-http-client'

import type { AxiosResponse } from 'axios'

export interface UsersService {
  getAll: () => Promise<AxiosResponse<User[], any>>
  getById: (id: string) => Promise<AxiosResponse<User, any>>
  updateById: (data: FormData) => Promise<AxiosResponse<User, any>>
  deleteById: (id: string) => Promise<AxiosResponse<boolean, any>>
}

export default (function () {
  const httpClient = useHttpClient()

  const getAll = () => {
    return httpClient.get<User[]>('/users')
  }

  const getById = (id: string) => {
    return httpClient.get(`/users/${id}`)
  }

  const deleteById = (id: string) => {
    return httpClient.delete(`/users/${id}`)
  }

  const updateById = (data: FormData) => {
    return httpClient.put(`/users`, data)
  }

  const instance: UsersService = { getAll, getById, deleteById, updateById }

  return () => {
    return instance
  }
})()

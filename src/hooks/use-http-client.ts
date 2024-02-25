import { HttpClient } from '@/services'

import type { AxiosInstance } from 'axios'

export const useHttpClient = () => {
  const instance = HttpClient()
  return {
    ...instance
  } as AxiosInstance
}

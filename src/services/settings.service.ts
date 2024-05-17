import { useHttpClient } from '@/hooks/use-http-client'

import type { AxiosResponse } from 'axios'

export interface SettingsService {
  getAll: () => Promise<AxiosResponse<HttpResponseData<DAppsSettings>, any>>
  update: (
    data: DAppsSettings
  ) => Promise<AxiosResponse<HttpResponseData<DAppsSettings>, any>>
}

export default (function () {
  const httpClient = useHttpClient()

  const getAll = () => {
    return httpClient.get<HttpResponseData<DAppsSettings>>('/settings')
  }

  const update = (data: DAppsSettings) => {
    return httpClient.put(`/settings`, data)
  }

  const instance: SettingsService = { getAll, update }

  return () => {
    return instance
  }
})()

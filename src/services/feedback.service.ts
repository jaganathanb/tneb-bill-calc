import { useHttpClient } from '@/hooks'

import type { AxiosResponse } from 'axios'

export interface FeedbackService {
  getAll: (
    userId: string
  ) => Promise<AxiosResponse<HttpResponseData<DAppsNotification[]>, any>>
  update: (
    data: DAppsNotification
  ) => Promise<AxiosResponse<HttpResponseData<DAppsNotification>, any>>
}

export default (function () {
  const httpClient = useHttpClient()

  const getAll = (userId: string) => {
    return httpClient.get<HttpResponseData<DAppsNotification[]>>(
      `/notifications?userId=${userId}`
    )
  }

  const update = (data: DAppsNotification) => {
    return httpClient.put(`/notifications`, data)
  }

  const instance: FeedbackService = { getAll, update }

  return () => {
    return instance
  }
})()

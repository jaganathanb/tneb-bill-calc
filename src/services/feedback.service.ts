import { useHttpClient } from '@/hooks'

import type { AxiosResponse } from 'axios'

export interface FeedbackService {
  getAll: () => Promise<
    AxiosResponse<HttpResponseData<DAppsNotification[]>, any>
  >
  update: (
    data: DAppsNotification
  ) => Promise<AxiosResponse<HttpResponseData<DAppsNotification>, any>>

  deleteNotification: (
    data: DAppsNotification
  ) => Promise<AxiosResponse<HttpResponseData<boolean>, any>>
}

export default (function () {
  const httpClient = useHttpClient()

  const getAll = () => {
    return httpClient.get<HttpResponseData<DAppsNotification[]>>(
      `/notifications`
    )
  }

  const update = (data: DAppsNotification) => {
    return httpClient.put(`/notifications`, data)
  }

  const deleteNotification = (data: DAppsNotification) => {
    return httpClient.delete(`/notifications`, { data })
  }

  const instance: FeedbackService = { getAll, update, deleteNotification }

  return () => {
    return instance
  }
})()

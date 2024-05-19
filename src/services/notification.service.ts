import { useHttpClient } from '@/hooks/use-http-client'
import { sleep } from '@/utils'

import type { AxiosResponse } from 'axios'

export interface NotificationService {
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

  const update = async (data: DAppsNotification) => {
    await sleep(3000)

    return httpClient.put(`/notifications`, data)
  }

  const deleteNotification = async (data: DAppsNotification) => {
    await sleep(3000)

    return httpClient.delete(`/notifications`, { data })
  }

  const instance: NotificationService = { getAll, update, deleteNotification }

  return () => {
    return instance
  }
})()

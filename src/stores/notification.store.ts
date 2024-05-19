import { useEventSource } from '@vueuse/core'
import dayjs from 'dayjs'
import { orderBy } from 'lodash'
import { acceptHMRUpdate, defineStore } from 'pinia'

import { NotificationService } from '@/services'

import { useFeedbackStore } from './feedback.store'

const notifications = ref<DAppsNotification[]>([])

export const useNotificationStore = defineStore('notification', () => {
  const nService = NotificationService()
  const feedback = useFeedbackStore()

  const { data } = useEventSource(
    `${window.__dapps.apiUrl}/stream/?token=${atob(
      localStorage.getItem(`${localStorage.getItem('userName')}_token`) ?? ''
    )}`,
    [],
    {
      withCredentials: false,
      autoReconnect: {
        retries: 3,
        delay: 1000,
        onFailed() {
          feedback.setNotification({
            message: 'Failed to connect EventSource after 3 retries',
            type: 'error'
          })
        }
      }
    }
  )

  const updateNotification = (message: DAppsNotification) => {
    return nService.update(message)
  }

  const deleteNotification = (message: DAppsNotification) => {
    return nService.deleteNotification(message)
  }

  const getAllNotifications = async () => {
    const result = await nService.getAll()
    if (result.status === 200) {
      notifications.value.splice(
        0,
        notifications.value.length,
        ...orderBy(result.data.result, (n) => dayjs(n.createdAt), 'desc')
      )
    }
  }

  return {
    notification: data,
    notifications,
    getAllNotifications,
    updateNotification,
    deleteNotification
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot))
}

import { getCurrentInstance } from 'vue'

import { useEventSource } from '@vueuse/core'
import {
  ElMessage,
  ElMessageBox,
  type ElMessageBoxOptions,
  ElNotification,
  type MessageOptions,
  type NotificationOptions,
  type NotificationParams
} from 'element-plus'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { orderBy } from 'lodash'
import dayjs from 'dayjs'

import { feedbackService } from '@/services'

const notifications = ref<DAppsNotification[]>([])

const setMessage = (feedback: Partial<MessageOptions>) => {
  const context = getCurrentInstance()

  return ElMessage({
    ...feedback,
    appContext: context
  } as MessageOptions)
}

const setNotification = (feedback: Partial<NotificationOptions>) => {
  const context = getCurrentInstance()

  return ElNotification({
    ...feedback,
    appContext: context
  } as NotificationParams)
}

const getConfirmation = (options: Partial<ElMessageBoxOptions>) => {
  const context = getCurrentInstance()

  return ElMessageBox(options, context?.appContext)
}

export const useFeedbackStore = defineStore('feedback', () => {
  const fbService = feedbackService()
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
          setNotification({
            message: 'Failed to connect EventSource after 3 retries',
            type: 'error'
          })
        }
      }
    }
  )

  const updateNotification = (message: DAppsNotification) => {
    return fbService.update(message)
  }

  const deleteNotification = (message: DAppsNotification) => {
    return fbService.deleteNotification(message)
  }

  const getAllNotifications = async () => {
    const result = await fbService.getAll()
    if (result.status === 200) {
      notifications.value = orderBy(
        result.data.result,
        (n) => dayjs(n.createdAt),
        'desc'
      )
    }
  }

  return {
    notification: data,
    notifications,
    alert,
    setMessage,
    setNotification,
    getConfirmation,
    getAllNotifications,
    updateNotification,
    deleteNotification
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFeedbackStore, import.meta.hot))
}

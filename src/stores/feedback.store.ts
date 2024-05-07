import { getCurrentInstance } from 'vue'

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
import { useEventSource } from '@vueuse/core'

import { feedbackService } from '@/services'

import { useAuthStore } from './auth.store'

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
  const authStore = useAuthStore()
  const fbService = feedbackService()
  const { data } = useEventSource(
    `${window.__dapps.apiUrl}/stream/?token=${atob(
      localStorage.getItem(`${localStorage.getItem('userId')}_token`) ?? ''
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

  const getAllNotifications = async (userId?: string) => {
    return fbService.getAll(userId ?? authStore.currentUser?.userId ?? '')
  }

  return {
    notification: data,
    alert,
    setMessage,
    setNotification,
    getConfirmation,
    getAllNotifications
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFeedbackStore, import.meta.hot))
}

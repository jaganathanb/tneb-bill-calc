import {
  ElMessage,
  ElMessageBox,
  ElNotification,
  type AlertProps,
  type ElMessageBoxOptions,
  type MessageOptions,
  type NotificationOptions,
  type NotificationParams
} from 'element-plus'
import { defineStore } from 'pinia'
import { getCurrentInstance } from 'vue'

export const useFeedbackStore = defineStore('feedback', () => {
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

  return {
    alert,
    setMessage,
    setNotification,
    getConfirmation
  }
})

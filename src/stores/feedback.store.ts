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
import { defineStore } from 'pinia'

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
  return {
    alert,
    setMessage,
    setNotification,
    getConfirmation
  }
})

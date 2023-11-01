import {
  ElNotification,
  type AlertProps,
  type NotificationParams,
  ElMessage,
  type MessageOptions
} from 'element-plus'
import { defineStore } from 'pinia'
import { getCurrentInstance, ref, type Ref } from 'vue'

type FeedbackModel = AlertProps & { key: number }

type FeedbackType = 'alert' | 'notification' | 'message'

type Feedback = {
  model: FeedbackModel
  type: FeedbackType
}

export const useFeedbackStore = defineStore('feedback', () => {
  const alert: Ref<FeedbackModel | null> = ref(null)

  const setFeedback = (feedback: Feedback) => {
    const context = getCurrentInstance()

    switch (feedback.type) {
      case 'alert':
        alert.value = { ...feedback.model }
        break
      case 'notification':
        ElNotification({
          message: feedback.model.description,
          type: feedback.model.type,
          title: feedback.model.title,
          appContext: context
        } as NotificationParams)
        break
      default:
        ElMessage({
          message: feedback.model.description,
          type: feedback.model.type,
          title: feedback.model.title,
          appContext: context
        } as MessageOptions)
        break
    }
  }

  const success = (message: string, type: FeedbackType = 'message') =>
    setFeedback({
      model: {
        description: message,
        type: 'success',
        title: 'Success'
      } as FeedbackModel,
      type
    })

  const error = (message: string, type: FeedbackType = 'message') =>
    setFeedback({
      model: {
        description: message,
        type: 'error',
        title: 'Error'
      } as FeedbackModel,
      type
    })

  const warn = (message: string, type: FeedbackType = 'message') =>
    setFeedback({
      model: {
        description: message,
        type: 'warning',
        title: 'Warning'
      } as FeedbackModel,
      type
    })

  const info = (message: string, type: FeedbackType = 'message') =>
    setFeedback({
      model: {
        description: message,
        type: 'info',
        title: 'Info'
      } as FeedbackModel,
      type
    })

  const clearAlert = () => (alert.value = null)

  return {
    alert,
    success,
    error,
    info,
    warn,
    clearAlert
  }
})

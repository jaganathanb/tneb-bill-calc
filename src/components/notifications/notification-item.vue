<script setup lang="ts">
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

import { useFeedbackStore } from '@/stores'

dayjs.extend(duration)
dayjs.extend(relativeTime)
defineProps({
  message: {
    type: Object as PropType<DAppsNotification>,
    required: true
  }
})

const feedback = useFeedbackStore()
const processing = ref(false)

const updateReadStatus = async (message: DAppsNotification) => {
  if (!message.isRead) {
    message.isRead = true
    await feedback.updateNotification(message)
  }
}

const updateDeleteStatus = async (message: DAppsNotification) => {
  processing.value = true
  await feedback.deleteNotification(message)

  await feedback.getAllNotifications()
  processing.value = false
}
</script>

<template>
  <el-alert
    class="p-2"
    :title="message.title"
    :type="message.messageType"
    :description="message.message"
    show-icon
    closable
    @click="updateReadStatus(message)"
    @close="updateDeleteStatus(message)"
  />
</template>

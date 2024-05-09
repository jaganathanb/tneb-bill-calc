<script setup lang="ts">
import { SuccessFilled } from '@element-plus/icons-vue'
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
  message.isRead = true
  await feedback.updateNotification(message)
}

const updateDeleteStatus = async (message: DAppsNotification) => {
  processing.value = true
  await feedback.deleteNotification(message)

  setTimeout(async () => {
    await feedback.getAllNotifications()
    processing.value = false
  }, 2000)
}
</script>

<template>
  <div class="p-2" @click="updateReadStatus(message)">
    <el-alert
      :title="message.title"
      :type="message.messageType"
      :description="message.message"
      show-icon
      @close="updateDeleteStatus(message)"
    />
  </div>
</template>

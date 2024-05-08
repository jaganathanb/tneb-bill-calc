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
  <div
    v-loading="processing"
    class="activity-item"
    @click="updateReadStatus(message)"
  >
    <div class="flex flex-content-center flex-wrap mr-3">
      <el-icon color="green" size="20"><SuccessFilled /></el-icon>
    </div>
    <div class="message">
      <el-text :line-clamp="5">{{ message.message }}</el-text>
    </div>
    <div>
      <el-button
        type="danger"
        circle
        text
        @click.stop="updateDeleteStatus(message)"
        >x</el-button
      >
    </div>
  </div>
  <div class="flex justify-end">
    <el-text :size="'small'">
      {{
        dayjs.duration(dayjs(message.createdAt).diff(dayjs())).humanize(true)
      }}
    </el-text>
  </div>
</template>

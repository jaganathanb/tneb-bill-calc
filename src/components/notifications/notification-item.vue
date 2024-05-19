<script setup lang="ts">
import {
  CircleCloseFilled,
  InfoFilled,
  SuccessFilled,
  WarningFilled
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

import { useNotificationStore } from '@/stores/notification.store'

dayjs.extend(duration)
dayjs.extend(relativeTime)

defineProps({
  message: {
    type: Object as PropType<DAppsNotification>,
    required: true
  }
})

const notiStore = useNotificationStore()
const progress = ref(false)

const alertType = {
  info: {
    class: 'el-alert--info',
    icon: InfoFilled
  },
  success: {
    class: 'el-alert--success',
    icon: SuccessFilled
  },
  warning: {
    class: 'el-alert--warning',
    icon: WarningFilled
  },
  error: {
    class: 'el-alert--error',
    icon: CircleCloseFilled
  }
}

const updateReadStatus = async (message: DAppsNotification) => {
  if (!message.isRead) {
    progress.value = true

    message.isRead = true
    await notiStore.updateNotification(message)

    progress.value = false
  }
}

const updateDeleteStatus = async (message: DAppsNotification) => {
  progress.value = true

  await notiStore.deleteNotification(message)
  await notiStore.getAllNotifications()

  progress.value = false
}
</script>

<template>
  <div
    v-loading="progress"
    class="el-alert is-light p-2"
    :class="alertType[message.messageType].class"
    role="alert"
    @click="updateReadStatus(message)"
  >
    <el-icon :size="24"
      ><component :is="alertType[message.messageType].icon"
    /></el-icon>
    <div class="el-alert__content">
      <p class="el-alert__description">{{ message.message }}</p>
      <div
        class="el-alert__close-btn is-customed"
        @click="updateDeleteStatus(message)"
      >
        x
      </div>
    </div>
  </div>
  <div class="flex justify-end">
    <el-text size="small" style="font-size: 0.8em; font-style: italic">
      {{
        dayjs.duration(dayjs(message.createdAt).diff(dayjs())).humanize(true)
      }}
    </el-text>
  </div>
</template>

<style lang="scss">
.el-alert .el-alert__close-btn.is-customed {
  right: 6px;
}
</style>

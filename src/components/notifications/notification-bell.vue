<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'

import { useFeedbackStore } from '@/stores'

const feedback = useFeedbackStore()
const { notification } = storeToRefs(feedback)

const notifications = ref<Partial<DAppsNotification>[]>([])

watch(notification, (data) => {
  const message = JSON.parse(data ?? '{}')

  if (message.message && message.code === 'NOTIFICATION') {
    notifications.value.push({
      message: message.message,
      messageType: message.type ?? 'info',
      title: message.Title ?? 'Info'
    })
  }
})

onMounted(async () => {
  const result = await feedback.getAllNotifications()
  if (result.status === 200) {
    notifications.value = result.data.result
  }
})
</script>

<template>
  <el-popover placement="bottom" :width="400" trigger="click">
    <template #reference>
      <el-badge class="item" :value="notifications.length">
        <el-button circle>
          <template #icon>
            <Bell />
          </template>
        </el-button>
      </el-badge>
    </template>
    <div class="box-card">
      <div class="card-header">Notifications</div>
      <ul v-for="(notf, i) in notifications" :key="i">
        <ol>
          {{
            notf.message
          }}
        </ol>
      </ul>
    </div>
  </el-popover>
</template>

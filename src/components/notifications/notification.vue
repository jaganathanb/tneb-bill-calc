<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useFeedbackStore } from '@/stores'

import NotificationBell from './notification-bell.vue'
import NotificationItem from './notification-item.vue'

const feedback = useFeedbackStore()
const { notification, notifications } = storeToRefs(feedback)

watch(notification, async (data) => {
  const message = JSON.parse(data ?? '{}') as DAppsNotification

  if (message.message && message.code === 'NOTIFICATION') {
    await feedback.getAllNotifications()
  }
})

onMounted(async () => {
  await feedback.getAllNotifications()
})
</script>

<template>
  <el-popover placement="bottom" :width="400" trigger="click">
    <template #reference>
      <NotificationBell
        :count="notifications.filter((n) => !n.isRead).length"
      />
    </template>
    <template #default>
      <section class="panel">
        <header class="panel-heading">
          <strong>Notifications</strong>
        </header>
        <el-container
          v-if="notifications.length > 0"
          class="notification-container"
          direction="vertical"
        >
          <div
            v-for="(msg, i) in notifications"
            :key="i"
            :class="msg.isRead ? 'read' : 'unread'"
          >
            <NotificationItem :message="msg" />
          </div>
        </el-container>
        <el-container v-else class="flex-justify-center">
          <el-empty
            :image-size="50"
            description="No new notification available for you"
          />
        </el-container>
      </section>
    </template>
  </el-popover>
</template>

<style lang="scss">
.el-divider--horizontal {
  margin: 8px 0;
}

.notification-container {
  max-height: 500px;
  overflow: auto;

  .unread {
    background: lightgoldenrodyellow;
    cursor: pointer;
  }

  .read {
    background: unset;
  }
}

.activity-item {
  display: flex;
  padding: 7px 12px;
  a {
    font-weight: 600;
  }

  .message {
    flex-basis: 100%;
    display: flex;
  }
}
</style>

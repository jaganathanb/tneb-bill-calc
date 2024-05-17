<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useNotificationStore } from '@/stores/notification.store'

import NotificationBell from './notification-bell.vue'
import NotificationItem from './notification-item.vue'

const notiStore = useNotificationStore()
const { notification, notifications } = storeToRefs(notiStore)

watch(notification, async (data) => {
  const message = JSON.parse(data ?? '{}') as DAppsNotification

  if (message.message && message.code === 'NOTIFICATION') {
    await notiStore.getAllNotifications()
  }
})

const updateReadStatus = async (message: DAppsNotification) => {
  if (!message.isRead) {
    message.isRead = true
    await notiStore.updateNotification(message)
  }
}

const updateDeleteStatus = async (message: DAppsNotification) => {
  await notiStore.deleteNotification(message)

  await notiStore.getAllNotifications()
}

onMounted(async () => {
  await notiStore.getAllNotifications()
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
          class="notification-container gap-2"
          direction="vertical"
        >
          <div
            v-for="(msg, i) in notifications"
            :key="i"
            :class="msg.isRead ? 'read' : 'unread'"
            @click="() => updateReadStatus(msg)"
          >
            <NotificationItem
              :message="msg"
              @remove="() => updateDeleteStatus(msg)"
            />
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
    > div[class*='el-alert--'] {
      background: #d1d1d1;
      cursor: pointer;
    }
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

<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
import { useCurrentUser } from 'vuefire'

import { router } from '@/router'
import { useAuthStore } from '@/stores'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const user = useCurrentUser()
const authStore = useAuthStore()

const signOut = async () => {
  await authStore.signOut()

  await router.push('/auth')
}
</script>

<template>
  <el-menu mode="horizontal" :ellipsis="false">
    <el-menu-item>
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        TNEB
      </button>
    </el-menu-item>
    <div class="flex-grow-1" />
    <el-menu-item @click="toggleDark()">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        test
      </button>
    </el-menu-item>
    <el-menu-item>
      <el-popover placement="bottom" :width="300" trigger="click">
        <template #reference>
          <el-avatar size="default" alt="JaganB" :icon="'account'" />
        </template>
        <div class="box-card">
          <div class="card-header">
            <span>{{ user?.displayName }}</span>
            <el-button class="button" text @click="signOut()"
              >Sign out</el-button
            >
          </div>
        </div>
      </el-popover>
    </el-menu-item>
  </el-menu>
</template>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
}
</style>

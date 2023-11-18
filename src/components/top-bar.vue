<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
import { useCurrentUser } from 'vuefire'

import logoImage from '../assets/img/logo-48_x_48.png'
import { Sunny, Moon } from '@element-plus/icons-vue'

import { router } from '@/router'
import { useAuthStore } from '@/stores'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const user = useCurrentUser()
const authStore = useAuthStore()

const value1 = ref(true)

const signOut = async () => {
  await authStore.signOut()

  await router.push('/auth')
}
</script>

<template>
  <el-menu
    mode="horizontal"
    :ellipsis="false"
    style="background-color: var(--app-bg-color)"
  >
    <el-menu-item>
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        <el-image :src="logoImage" fit="fill"></el-image>
      </button>
    </el-menu-item>
    <div class="flex-grow-1" />
    <el-menu-item>
      <el-switch
        v-model="value1"
        @change="toggleDark()"
        :active-action-icon="Sunny"
        :inactive-action-icon="Moon"
      />
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

.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  background-color: var(--app-bg-color);
}
</style>

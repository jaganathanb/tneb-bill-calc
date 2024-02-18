<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'

import { Sunny, Moon } from '@element-plus/icons-vue'

import { router } from '@/router'
import { useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia';

const isDark = useDark()
const toggleDark = useToggle(isDark)

const authStore = useAuthStore()
const { currentUser } =  storeToRefs(authStore)

const value1 = ref(true)

const signOut = async () => {
  await authStore.signOut()

  location.reload()
}
</script>

<template>
  <el-menu mode="horizontal" :ellipsis="false">
    <el-menu-item style="padding: 0">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        <SvgImg :name="'DhuruvahApps'" :width="64" :height="56"></SvgImg>
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
            <span>{{ currentUser?.firstName }}</span>
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

.box-card {
  width: 100%;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  background-color: var(--el-menu-bg-color);
}
</style>

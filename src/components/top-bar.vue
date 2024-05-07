<script lang="ts" setup>
import { Moon, Sunny, User } from '@element-plus/icons-vue'
import { useDark, useToggle } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores'
import { NotificationBell } from '@/components/notifications'

import SvgImg from './svg-img.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)

const theme = ref(true)

const signOut = async () => {
  await authStore.signOut()

  location.reload()
}
</script>

<template>
  <el-page-header icon="">
    <template #icon />
    <template #title
      ><SvgImg :name="'DhuruvahApps'" style="width: 3em; height: 3em"
    /></template>
    <template #extra>
      <el-switch
        v-model="theme"
        :active-color="'grey'"
        :inactive-color="'skyblue'"
        :active-action-icon="Moon"
        :inactive-action-icon="Sunny"
        @change="toggleDark()"
      />
      <el-divider :direction="'vertical'" />
      <NotificationBell />
      <el-divider :direction="'vertical'" />
      <el-popover placement="bottom" :width="300" trigger="click">
        <template #reference>
          <el-button circle>
            <template #icon>
              <User />
            </template>
          </el-button>
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
    </template>
    <template #default />
  </el-page-header>
</template>

<style lang="scss">
.el-header {
  height: unset;

  .el-page-header__header {
    padding-right: 20px;

    .el-page-header__title {
      display: flex;
      padding: 8px 0;
    }

    .el-page-header__left .el-divider--vertical {
      display: none;
    }
  }

  .el-page-header.is-contentful .el-page-header__main {
    margin-top: 0;
  }
}
</style>

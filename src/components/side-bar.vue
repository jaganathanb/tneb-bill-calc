<script lang="ts" setup>
import { useAppStore } from '@/stores/app.store'
import {
  Document,
  Menu as IconMenu,
  SwitchButton,
  Setting,
  ArrowRightBold,
  ArrowLeftBold
} from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()

const { isCollapse } = storeToRefs(appStore)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const toggleSideBar = (index: string) => {
  if (index === '3') {
    appStore.setIsCollapse(!isCollapse.value)
  }
}
</script>

<template>
  <el-container direction="vertical">
    <el-row class="h-full">
      <el-container direction="vertical">
        <el-row class="flex-grow-1">
          <el-menu
            default-active="1"
            router
            class="da-app-menu h-full"
            :collapse="isCollapse"
          >
            <el-menu-item index="1" route="/dashboard">
              <el-icon><IconMenu /></el-icon>
              <template #title>Dashboard</template>
            </el-menu-item>
            <el-menu-item index="2" route="/bills">
              <el-icon><Document /></el-icon>
              <template #title>Bills</template>
            </el-menu-item>
          </el-menu>
        </el-row>

        <el-row>
          <el-menu
            class="da-app-menu bottom-part"
            style="min-height: auto"
            :collapse="isCollapse"
            @select="toggleSideBar"
          >
            <el-menu-item index="3" class="side-toggle">
              <el-icon v-if="isCollapse">
                <ArrowRightBold />
              </el-icon>
              <template #title v-if="!isCollapse"
                ><el-container class="justify-center">
                  <el-icon>
                    <ArrowLeftBold />
                  </el-icon>
                </el-container>
              </template>
            </el-menu-item>
          </el-menu>
        </el-row>
      </el-container>
    </el-row>
  </el-container>
</template>

<style>
.da-app-menu:not(.el-menu--collapse) {
  width: 300px;
  min-height: 400px;
  background-color: var(--app-bg-color);
}

.da-app-menu.bottom-part.el-menu--vertical .el-menu-item.side-toggle:hover,
.da-app-menu.bottom-part.el-menu--vertical .el-menu-item.side-toggle:focus {
  background-color: var(--app-bg-color);
  color: var(--el-menu-text-color);
}

.da-app-menu.bottom-part.el-menu--vertical .el-menu-item.side-toggle.is-active {
  color: var(--el-menu-text-color);
}
</style>

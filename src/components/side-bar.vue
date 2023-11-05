<script lang="ts" setup>
import { useAppStore } from '@/stores/app.store'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting
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
</script>

<template>
  <el-container direction="vertical">
    <el-row>
      <el-container class="hamberger-container w-full">
        <el-col :span="4">Test</el-col>
        <el-col :span="20">Icon</el-col>
      </el-container>
    </el-row>
    <el-row class="h-full">
      <el-container>
        <el-row>
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo h-full"
            :collapse="isCollapse"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon><location /></el-icon>
                <span>Navigator One</span>
              </template>
              <el-menu-item-group>
                <template #title><span>Group One</span></template>
                <el-menu-item index="1-1">item one</el-menu-item>
                <el-menu-item index="1-2">item two</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group Two">
                <el-menu-item index="1-3">item three</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="1-4">
                <template #title><span>item four</span></template>
                <el-menu-item index="1-4-1">item one</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-menu-item index="2">
              <el-icon><icon-menu /></el-icon>
              <template #title>Navigator Two</template>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <el-icon><document /></el-icon>
              <template #title>Navigator Three</template>
            </el-menu-item>
            <el-menu-item index="4">
              <el-icon><setting /></el-icon>
              <template #title>Navigator Four</template>
            </el-menu-item>
          </el-menu>
        </el-row>
      </el-container>
    </el-row>
  </el-container>
</template>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 300px;
  min-height: 400px;
}

.hamberger-container {
  height: var(--el-menu-item-height);
  border-right: solid 1px var(--el-menu-border-color);
}
</style>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

const properties = defineProps<{
  routeConfig: RouteRecordRaw
  index: string
}>()
</script>

<template>
  <el-sub-menu
    v-if="properties.routeConfig.children?.length"
    :index="properties.index"
  >
    <template #title>
      <el-icon><component :is="properties.routeConfig.meta?.icon" /></el-icon>
      <span>{{ properties.routeConfig.meta?.label }}</span>
    </template>
    <el-menu-item
      v-for="(r, i) in properties.routeConfig.children"
      :key="i"
      :index="r.path"
      :route="r"
    >
      <el-icon><component :is="r.meta?.icon" /></el-icon>
      {{ r.meta?.label }}
    </el-menu-item>
  </el-sub-menu>
  <el-menu-item
    v-else
    :index="properties.index"
    :route="properties.routeConfig"
  >
    <el-icon><component :is="properties.routeConfig.meta?.icon" /></el-icon>
    <template #title
      ><span>{{ properties.routeConfig.meta?.label }}</span></template
    >
  </el-menu-item>
</template>

<style scoped></style>

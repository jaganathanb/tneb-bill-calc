<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

const props = defineProps<{
  routeConfig: RouteRecordRaw
  index: string
}>()
</script>

<template>
  <el-sub-menu :index="props.index" v-if="props.routeConfig.children?.length">
    <template #title>
      <el-icon><component :is="props.routeConfig.meta?.icon" /></el-icon>
      <span>{{ props.routeConfig.meta?.label }}</span>
    </template>
    <el-menu-item
      v-for="(r, i) in props.routeConfig.children"
      :key="i"
      :index="r.path"
      :route="r"
    >
      <el-icon><component :is="r.meta?.icon"></component></el-icon>
      {{ r.meta?.label }}
    </el-menu-item>
  </el-sub-menu>
  <el-menu-item v-else :index="props.index" :route="props.routeConfig">
    <el-icon
      ><component :is="props.routeConfig.meta?.icon"></component
    ></el-icon>
    <template #title
      ><span>{{ props.routeConfig.meta?.label }}</span></template
    >
  </el-menu-item>
</template>

<style scoped></style>

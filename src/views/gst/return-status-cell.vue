<script setup lang="ts">
import type { Component, PropType, VNode } from 'vue'

type StatusDropdownItem = {
  icon: VNode | Component
  color: string
  label: string
}

defineProps({
  returnStatus: {
    type: Object as PropType<StatusDropdownItem>,
    required: true
  }
})
</script>

<template>
  <div class="flex flex-items-center">
    <el-icon size="18" :color="returnStatus.color" style="margin-right: 8px">
      <component :is="returnStatus.icon" /> </el-icon
    ><span>{{ returnStatus.label }}</span>
  </div>
</template>

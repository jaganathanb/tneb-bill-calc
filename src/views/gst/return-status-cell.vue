<script setup lang="ts">
import type { OptionType } from 'element-plus/es/components/select-v2/src/select.types'
import type { Component, PropType, VNode } from 'vue'

type StatusDropdownItem = OptionType & {
  icon: VNode | Component
  color: string
}

const properties = defineProps({
  returnStatus: {
    type: Object as PropType<StatusDropdownItem>,
    required: true
  }
})
</script>

<template>
  <el-icon
    size="18"
    :color="properties.returnStatus.color"
    style="margin-right: 8px"
  >
    <component :is="properties.returnStatus.icon" /> </el-icon
  ><el-text>{{ properties.returnStatus.label }}</el-text>
</template>

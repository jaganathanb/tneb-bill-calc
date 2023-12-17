<script setup lang="ts">
import { DocumentChecked, Memo, Phone, Select } from '@element-plus/icons-vue'
import type { OptionType } from 'element-plus/es/components/select-v2/src/select.types'
import type { Component } from 'vue'
import type { PropType } from 'vue'

import { useGSTsStore } from '@/stores/gsts.store'

type GSTRStatus = {
  gstr1Status: string | null
  gstr3bStatus?: string | null
}

type StatusDropdownItem = OptionType & {
  icon: VNode | Component
  color: string
}

const props = defineProps({
  gst: {
    type: Object as PropType<GST>,
    required: true
  },
  type: {
    type: String as PropType<GSTReturnType>
  }
})

const r1StatusOptions = [
  {
    label: 'Call for invoice',
    icon: Phone,
    color: 'blue',
    value: 1
  },
  {
    label: 'Invoice received',
    icon: DocumentChecked,
    color: 'orange',
    value: 2
  },
  {
    label: 'Entry done',
    icon: Memo,
    color: 'lightBlue',
    value: 3
  },
  {
    label: 'Filed',
    icon: Select,
    color: 'green',
    value: 4
  }
] as StatusDropdownItem[]

const status = computed(() => {
  return (
    r1StatusOptions.find(
      (s) =>
        s.value ===
        (props.type === 'GSTR1'
          ? props.gst.gstr1LastStatus
          : props.gst.gstr3bLastStatus)
    ) || r1StatusOptions[0]
  )
})
</script>

<template>
  <el-icon size="18" :color="status.color" style="margin-right: 8px"
    ><component :is="status.icon"></component></el-icon
  ><el-text>{{ status.label }}</el-text>
</template>

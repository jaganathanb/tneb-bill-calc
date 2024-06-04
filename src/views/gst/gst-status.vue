<script setup lang="ts">
import { PendingReturnWarning, ReturnStatusCellDropDown } from '.'

import type { PropType } from 'vue'

defineProps({
  gst: {
    type: Object as PropType<GstMap>,
    required: true
  },
  type: {
    type: String as PropType<GSTReturnTypeLowered>,
    required: true
  }
})

const emits = defineEmits<{ statusChange: [status: string] }>()
</script>

<template>
  <ReturnStatusCellDropDown
    :return-status="gst[type]"
    @status-change="(s: string) => emits('statusChange', s)"
  />
  <PendingReturnWarning :gst-status="gst[type]" />
</template>

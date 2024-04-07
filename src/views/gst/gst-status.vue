<script setup lang="ts">
import { PendingReturnWarning, ReturnStatusCellDropDown } from '.'

import type { PropType } from 'vue'

const properties = defineProps({
  gst: {
    type: Object as PropType<GstMap>,
    required: true
  },
  type: {
    type: String as PropType<GSTReturnType>,
    required: true
  }
})

const emits = defineEmits<{ statusChange: [status: string] }>()

let returnStatus: GstStatus = {} as GstStatus

onBeforeMount(() => {
  switch (properties.type) {
    case 'GSTR1': {
      returnStatus = properties.gst.gstr1
      break
    }
    case 'GSTR3B': {
      returnStatus = properties.gst.gstr3b
      break
    }
    case 'GSTR2': {
      returnStatus = properties.gst.gstr2
      break
    }
    case 'GSTR9': {
      returnStatus = properties.gst.gstr9
      break
    }
    default: {
      returnStatus = properties.gst.gstr1
      break
    }
  }
})
</script>

<template>
  <ReturnStatusCellDropDown
    :return-status="returnStatus"
    @status-change="(s: string) => emits('statusChange', s)"
  />
  <PendingReturnWarning :gst-status="returnStatus" />
</template>

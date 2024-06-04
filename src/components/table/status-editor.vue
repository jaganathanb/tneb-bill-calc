<script setup lang="ts">
import PendingReturnWarning from '@/views/gst/pending-return-warning.vue'
import ReturnStatusCellDropdown from '@/views/gst/return-status-cell-dropdown.vue'

import type { ICellEditorParams } from '@ag-grid-community/core'
import type { PropType } from 'vue'
const happy = ref(false)
const container = ref<HTMLElement>()

const properties = defineProps({
  params: {
    type: Object as PropType<
      ICellEditorParams<any, any, any> & { type: GSTReturnTypeLowered }
    >
  }
})

const onKeyDown = (event: KeyboardEvent) => {
  const key = event.key
  if (
    key == 'ArrowLeft' || // left
    key == 'ArrowRight'
  ) {
    // right
    toggleMood()
    event.stopPropagation()
  }
}

const onClick = (hpy: boolean) => {
  setHappy(hpy)
  properties.params?.stopEditing()
}

const toggleMood = () => {
  setHappy(!happy.value)
}

const setHappy = (hpy: boolean) => {
  happy.value = hpy
}

const getValue = () => {
  return happy ? 'Happy' : 'Sad'
}

onMounted(async () => {
  await nextTick(() => {
    //container.value?.focus()
    setHappy(true)
  })
})
</script>

<template>
  <ReturnStatusCellDropdown
    ref="container"
    :return-status="params?.data[params.type] ?? {}"
  />
  <PendingReturnWarning :gst-status="params?.data[params.type] ?? {}" />
</template>

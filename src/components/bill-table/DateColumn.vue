<script setup lang="ts">
import dayjs from 'dayjs'

withDefaults(
  defineProps<{
    format?: string
  }>(),
  {
    format: 'DD/MM/YYYY HH:mm:ss'
  }
)
</script>

<template>
  <el-table-column
    v-bind="$attrs"
    min-width="100"
    sortable
    show-overflow-tooltip
  >
    <template #default="scope">
      {{ dayjs(scope.row[$attrs.prop as string]).format(format) }}
    </template>
  </el-table-column>
</template>

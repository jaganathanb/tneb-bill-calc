<script setup lang="ts">
import { computed } from 'vue'

import { PAGE_LIMIT } from '@/constants'

const properties = withDefaults(
  defineProps<{
    total?: number
    page?: number
    limit?: number
    layout?: string
    background?: boolean
    hidden?: boolean
  }>(),
  {
    total: 0,
    page: 1,
    limit: PAGE_LIMIT,
    layout: 'total,sizes,prev,next',
    autoScroll: true
  }
)

const emit = defineEmits<{
  (event: 'update:page', value: number): void
  (event: 'update:limit', value: number): void
  (event: 'pagination', value: PageConfig): void
}>()

const currentPage = computed({
  get: () => properties.page,
  set: (value) => {
    emit('update:page', value)
  }
})

const pageSize = computed({
  get: () => properties.limit,
  set: (value) => {
    emit('update:limit', value)
  }
})

function handleSizeChange(value: number) {
  pageSize.value = value
  emit('pagination', { page: currentPage.value, size: value })
}

function handleCurrentChange(value: number) {
  emit('pagination', { page: value, size: pageSize.value })
}
</script>

<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="[5, 10, 20, 50, 100]"
      :total="total"
      :background="background"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss">
.pagination-container {
  display: flex;
  clear: both;

  .el-pagination {
    margin: 20px auto;
  }

  .hidden {
    display: none;
  }
}
</style>

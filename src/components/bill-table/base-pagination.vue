<script setup lang="ts">
import { PAGE_LIMIT } from '@/constants'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    total: number
    page: number
    limit: number
    layout?: string
    background?: boolean
    hidden?: boolean
  }>(),
  {
    total: 0,
    page: 1,
    limit: PAGE_LIMIT,
    layout: 'total,sizes, prev, next',
    autoScroll: true
  }
)

const emit = defineEmits<{
  (e: 'update:page', value: number): void
  (e: 'update:limit', value: number): void
  (e: 'pagination', value: number): void
}>()

const currentPage = computed({
  get: () => props.page,
  set: (val) => {
    emit('update:page', val)
  }
})

const pageSize = computed({
  get: () => props.limit,
  set: (val) => {
    emit('update:limit', val)
  }
})

function handleSizeChange(val: number) {
  emit('pagination', val)
}
function handleCurrentChange(val: number) {
  emit('pagination', val)
}
</script>

<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="[10, 20, 50, 100]"
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

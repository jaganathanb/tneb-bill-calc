<script lang="ts" setup>
import { ref } from 'vue'

import { Select, Timer } from '@element-plus/icons-vue'
import { dayjs } from 'element-plus'

import BasePagination from '@/components/table/base-pagination.vue'
import { PAGE_LIMIT } from '@/constants'

const loading = ref(false)

const parameters = reactive({
  move: 'next',
  sort: 'dof',
  order: 'desc',
  limit: PAGE_LIMIT,
  page: 1
})

const pagedGstsReturns = computed(() => {
  return []
})
</script>

<template>
  <el-table
    v-loading="loading"
    :data="pagedGstsReturns"
    :border="true"
    style="width: 100%"
  >
    <el-table-column prop="ret_prd" :sortable="true" label="GST Month">
      <template #default="scope">
        <el-text>
          {{ dayjs(scope.row.ret_prd, 'MMYYYY').format('MMM YYYY') }}
        </el-text>
      </template>
    </el-table-column>
    <el-table-column prop="dof" type="date" :sortable="true" label="Filed date">
      <template #default="scope">
        <el-text>
          {{ dayjs(scope.row.dof, 'DD-MM-YYYY').format('DD MMM YYYY') }}
        </el-text>
      </template>
    </el-table-column>
    <el-table-column prop="rtntype" :sortable="true" label="Return type" />
    <el-table-column prop="status" label="Status">
      <template #default="scope">
        <el-space v-if="scope.row.status === 'Filed'">
          <el-icon :color="'green'"> <Select /></el-icon>
          Filed
        </el-space>
        <el-space v-else>
          <el-icon :color="'yellow'"><Timer /></el-icon>
          Pending
        </el-space>
      </template>
    </el-table-column>
  </el-table>
  <BasePagination
    v-model:page="parameters.page"
    v-model:limit="parameters.limit"
    :total="1"
  />
</template>

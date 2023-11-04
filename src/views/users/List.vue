<script lang="ts" setup>
import { useBillsStore } from '@/stores'
import { ElButton } from 'element-plus'
import { storeToRefs } from 'pinia'

const billStore = useBillsStore()

const { bills } = storeToRefs(billStore)
</script>

<template>
  <el-table :data="bills" style="width: 100%" border>
    <el-table-column fixed prop="dateRange" label="Date range" width="150" />
    <el-table-column prop="id" label="Bill id" width="120" />
    <el-table-column prop="amount" label="Amount" width="120" />
    <el-table-column prop="units" label="Units" width="120" />
    <el-table-column fixed="right" label="" width="120">
      <template #default>
        <el-button link type="primary" size="small">Detail</el-button>
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>

  <ElButton @click="billStore.addBill()">Add</ElButton>
</template>

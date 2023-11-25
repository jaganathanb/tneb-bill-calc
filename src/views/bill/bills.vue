<script lang="ts" setup>
import { useBillsStore } from '@/stores'
import { ElButton } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { PAGE_LIMIT } from '@/constants'
import type { BasePagination, BillSaveForm } from '@/components/bill-table'

const billStore = useBillsStore()

const { bills, totalBills } = storeToRefs(billStore)

const dialogVisible = ref(false)
const loading = ref(false)
const saveLoading = ref(false)
const form = reactive<Bill>({
  amount: 0,
  endDate: '',
  startDate: '',
  units: 0
} as Bill)

const layout = ref()
const params = reactive<Params>({
  page: 1,
  limit: PAGE_LIMIT,
  sort: 'startDate',
  order: 'desc'
})

const title = computed<string>(() => {
  if (form.id) return 'Edit'
  return 'Add'
})

// const columns: ElTableColumn[] = [
//   {
//     key: 'billId',
//     dataKey: 'billId',
//     title: 'Bill Id'
//   }
// ]

const handleSubmit = (payload: Bill) => {
  if (payload.id) {
    doEdit(payload)
  } else {
    doAdd(payload)
  }
}

watchEffect(() => {
  if (!saveLoading.value) {
    dialogVisible.value = false
  }
})

const toAdd = () => {
  dialogVisible.value = true
  // reset form
  Object.keys(form).forEach((item) => {
    const key = item as keyof Bill
    form[key] = undefined as never
  })
}

const toEdit = (row: Bill) => {
  dialogVisible.value = true
  Object.assign(form, row)
}

const doAdd = async (data: Bill) => {
  saveLoading.value = true

  try {
    await billStore.addBill(data, { ...params, page: 1 })
  } catch (error) {
    saveLoading.value = false
  }

  saveLoading.value = false
}

const doEdit = async (data: Bill) => {
  saveLoading.value = true
  try {
    await billStore.setBill(data)
    saveLoading.value = false
    const list = bills.value?.[params.page]
    const index = list?.findIndex((item) => item.id === data.id)
    if (index !== -1) {
      list?.splice(index as number, 1, data as Bill)
    }
  } catch (error) {
    saveLoading.value = false
  }
}

const loadPage = (p: number) => {
  billStore.loadPage({
    ...params,
    page: p
  })
}

const resetPagination = (size: number) => {
  billStore.loadPage({
    ...params,
    page: 1,
    limit: size
  })
}
</script>

<template>
  <el-button
    type="primary"
    :icon="Plus"
    @click="toAdd"
    style="margin-bottom: 8px"
  >
    Add
  </el-button>
  <el-table
    :data="bills?.[params.page]"
    :border="true"
    v-loading="loading"
    style="width: 100%"
  >
    <el-table-column fixed prop="startDate" label="Start date" />
    <el-table-column fixed prop="endDate" label="End date" />
    <el-table-column prop="billId" label="Bill id" width="120" />
    <el-table-column prop="amount" label="Amount" width="120" />
    <el-table-column prop="units" label="Units" width="120" />
    <el-table-column fixed="right" label="" width="120">
      <template #default>
        <el-button link type="primary" size="small">Detail</el-button>
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :close-on-click-modal="false"
  >
    <BillSaveForm
      :value="form"
      :loading="saveLoading"
      @submit="handleSubmit"
      @cancel="dialogVisible = false"
    />
  </el-dialog>
  <BasePagination
    v-model:page="params.page"
    v-model:limit="params.limit"
    :total="totalBills"
    :layout="layout"
    @update:limit="resetPagination"
    @update:page="loadPage"
  />
</template>

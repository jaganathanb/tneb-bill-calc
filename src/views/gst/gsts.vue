<script lang="ts" setup>
import { useGSTsStore, useFeedbackStore } from '@/stores'
import { ElButton } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { PAGE_LIMIT } from '@/constants'
import BasePagination from '@/components/table/base-pagination.vue'
import { useHttpClient } from '@/hooks'
import GSTReturns from './gst-returns.vue'

const gstStore = useGSTsStore()
const feedback = useFeedbackStore()
const httpClient = useHttpClient()

const { gsts, totalGSTs } = storeToRefs(gstStore)

const loading = ref(false)

const params = reactive<Params>({
  page: 1,
  limit: PAGE_LIMIT,
  sort: 'registrationDate',
  order: 'desc'
})

const details = ref(null)

const toAdd = async () => {
  try {
    const result = await feedback.getConfirmation({
      boxType: 'prompt',
      confirmButtonText: 'Add',
      inputType: 'text',
      showInput: true,
      inputPlaceholder: 'Enter GST number here',
      title: 'Add GST'
    })

    if (result.action === 'confirm') {
      loading.value = true
      const res = await httpClient.get(`/search?gstin=${result.value}`)
      if (res.status === 200) {
        doAdd(res.data)
      } else {
        loading.value = false
      }
    }
  } catch (error) {}
}

const doAdd = async (data: GST) => {
  loading.value = true

  try {
    await gstStore.addGST(data, { ...params, page: 1 })
  } catch (error) {
    loading.value = false
  }

  loading.value = false
}

const loadPage = (p: number) => {
  gstStore.loadPage({
    ...(params as Required<Params>),
    page: p
  })
}

const resetPagination = (size: number) => {
  gstStore.loadPage({
    ...params,
    page: 1,
    limit: size
  })
}

const deleteGST = async (data: GST) => {
  try {
    const result = (await feedback.getConfirmation({
      message: 'Are you sure want to delete the GST?',
      boxType: 'confirm',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      title: 'Confirm'
    })) as string

    if (result === 'confirm') {
      await gstStore.removeGST(data.id)
    }

    const list = gsts.value?.[params.page as number]
    const index = list?.findIndex((item) => item.id === data.id)
    if (index !== -1) {
      list?.splice(index as number, 1)
    }
    feedback.setMessage({ message: 'Delete successfully!', type: 'success' })
  } catch (error) {}
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
    :data="gsts?.[params.page as number]"
    :border="true"
    v-loading="loading"
    style="width: 100%"
  >
    <el-table-column type="expand">
      <template #default="scope">
        <GSTReturns :gst="scope.row"></GSTReturns>
      </template>
    </el-table-column>

    <el-table-column prop="gstin" width="150" label="GSTIN" />
    <el-table-column prop="owner" width="200" label="Owner" />
    <el-table-column prop="tradename" width="200" label="Trade name" />
    <el-table-column
      prop="registrationDate"
      label="Registration date"
      width="150"
    />
    <el-table-column prop="address" label="Address" />
    <el-table-column fixed="right" label="" width="70">
      <template #default="scope">
        <el-button
          type="danger"
          :icon="Delete"
          size="small"
          @click="deleteGST(scope.row)"
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
  <BasePagination
    v-model:page="params.page"
    v-model:limit="params.limit"
    :total="totalGSTs"
    @update:limit="resetPagination"
    @update:page="loadPage"
  />

  <el-text>
    {{ details }}
  </el-text>
</template>

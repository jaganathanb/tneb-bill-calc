<script lang="ts" setup>
import { Plus, Refresh } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElButton } from 'element-plus'
import { storeToRefs } from 'pinia'

import BasePagination from '@/components/table/base-pagination.vue'
import { PAGE_LIMIT } from '@/constants'
import { useGstsStore } from '@/stores/gsts.store'
import { useDDialog } from '@/stores/dialog.store'
import { useFeedbackStore } from '@/stores/feedback.store'
import { useNotificationStore } from '@/stores/notification.store'

import GstRowActions from './gst-row-actions.vue'
import GstStatistics from './gst-statistics.vue'
import GstStatus from './gst-status.vue'

import { UploadGst } from '.'

import type { AxiosError } from 'axios'

const gstStore = useGstsStore()
const feedback = useFeedbackStore()
const notiStore = useNotificationStore()
const dialog = useDDialog()

const { gsts, loading, statistics } = storeToRefs(gstStore)
const { notification } = storeToRefs(notiStore)
const { inProgress } = storeToRefs(dialog)

const search = ref('')
const pageSize = ref<number>(
  Number.parseInt(
    (localStorage.getItem('page-size') as string) ?? PAGE_LIMIT.toString(),
    10
  )
)
const currentPage = ref(1)

watch(notification, (data) => {
  const message = JSON.parse(data ?? '{}')

  if (message.message && message.code !== 'NOTIFICATION') {
    feedback.setNotification({
      message: message.message,
      type: message.type ?? 'info',
      title: message.Title ?? 'Info'
    })
  }

  if (message.code && message.code === 'REFRESH_GSTS_TABLE') {
    refreshPage()
  }
})

const add = () => {
  dialog.open(async (mappedGst: Gst[]) => {
    inProgress.value = true

    try {
      await gstStore.createByIds(mappedGst)

      inProgress.value = false
      dialog.close()

      await refreshPage()
    } catch (error: any) {
      const axiosError = error as AxiosError
      if (axiosError.code === 'Redirect') {
        console.error('Redirect')
      }
      inProgress.value = false
    }
  })
}

const deleteGST = async (data: GstMap) => {
  try {
    const result = (await feedback.getConfirmation({
      message: h('p', undefined, [
        h('span', undefined, 'Are you sure want to delete the GST '),
        h('i', { style: 'color: red; font-weight: 600' }, data.gstin),
        h('span', undefined, ' from system?')
      ]),
      boxType: 'confirm',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      title: 'Confirm'
    })) as string

    if (result === 'confirm') {
      const deleted = await gstStore.deleteById(data.gstin)

      if (deleted) {
        await refreshPage()
      }
    }

    feedback.setMessage({ message: 'Delete successfully!', type: 'success' })
  } catch {}
}

const onAction = async (data: { action: string; data: GstMap }) => {
  switch (data.action) {
    case 'view':
    case 'edit': {
      feedback.setMessage({
        message:
          'This action is not supported yet!. Please contact administrator.',
        type: 'warning'
      })
      break
    }
    case 'lock': {
      data.data.locked = true
      await gstStore.updateLockById(data.data.gstin, true)
      break
    }
    case 'refresh-returns': {
      await gstStore.refreshGstReturns()
      break
    }
    case 'delete': {
      await deleteGST(data.data)
      break
    }
    default: {
      break
    }
  }
}

const refreshPage = async () => {
  await gstStore.getAll({
    pageNumber: currentPage.value,
    pageSize: pageSize.value,
    filter: {
      Gstin: {
        filterType: 'text',
        type: 'contains',
        to: '',
        from: search.value
      }
    } as Filter
  } as PagingRequest)

  await gstStore.getGstStatistics()
}

const updateStatus = async (
  gstin: string,
  type: GSTReturnType,
  status: GstReturnStatus
) => {
  await gstStore.updateReturnStatusById(gstin, type, status)
}

const lockRow = ({ row }: { row: GST }) => {
  if (row.locked) {
    return 'error-row'
  }

  return ''
}

const unlockRow = async (data: GstMap) => {
  await gstStore.updateLockById(data.gstin, false)
}

const onSearch = (event_: KeyboardEvent | Event) => {
  if (event_ instanceof KeyboardEvent && event_.key === 'Enter') {
    gstStore.getAll({
      pageNumber: currentPage.value,
      pageSize: pageSize.value,
      filter: {
        Gstin: {
          filterType: 'text',
          type: 'contains',
          to: '',
          from: search.value
        }
      } as Filter
    } as PagingRequest)
  }
}

const paginateTable = async (page: PageConfig) => {
  loading.value = true

  localStorage.setItem('page-size', page.size.toString())

  await gstStore.getAll({
    pageNumber: page.page,
    pageSize: page.size
  } as PagingRequest)
}

onMounted(async () => {
  await gstStore.getAll({
    pageNumber: currentPage.value,
    pageSize: pageSize.value
  } as PagingRequest)

  await gstStore.getGstStatistics()
})
</script>

<template>
  <UploadGst />
  <el-container class="w-full">
    <el-row class="w-full flex-justify-between">
      <el-button
        type="primary"
        :icon="Plus"
        style="margin-bottom: 8px"
        @click="add"
      >
        Add
      </el-button>
      <GstStatistics :statistics="statistics" />
      <el-tooltip content="Refresh">
        <el-button
          :icon="Refresh"
          style="margin-bottom: 8px"
          @click="refreshPage"
        />
      </el-tooltip>
    </el-row>
  </el-container>
  <el-table
    v-loading="loading"
    :data="gsts?.items"
    class="w-full"
    :border="true"
    :row-class-name="lockRow"
  >
    <el-table-column prop="gstin" label="GSTIN" min-width="150" fixed>
      <template #header>
        <el-input
          v-model="search"
          size="small"
          placeholder="Enter GSTIN to search"
          @keydown="onSearch"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="mobileNumber"
      label="Mobile number"
      min-width="150"
      fixed
    />
    <el-table-column align="center" label="GSTR-1">
      <el-table-column label="Tax period" min-width="90">
        <template #default="{ row }">
          <span v-if="row.gstr1">{{
            dayjs(row.gstr1?.returnPeriod, 'MMYYYY').format('MMM YYYY')
          }}</span>
          <span v-else>N/A</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" min-width="170">
        <template #default="{ row }">
          <GstStatus
            v-if="row.gstr1"
            :gst="row"
            :type="'gstr1'"
            @status-change="
              (st: string) =>
                updateStatus(row.gstin, 'GSTR1', st as GstReturnStatus)
            "
          />
          <span v-else>N/A</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column align="center" label="GSTR-3B">
      <el-table-column label="Tax period" min-width="90">
        <template #default="{ row }">
          <span v-if="row.gstr3b">{{
            dayjs(row.gstr3b?.returnPeriod, 'MMYYYY').format('MMM YYYY')
          }}</span>
          <span v-else>N/A</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" min-width="170">
        <template #default="{ row }">
          <GstStatus
            v-if="row.gstr3b"
            :gst="row"
            :type="'gstr3b'"
            @status-change="
              (st: string) =>
                updateStatus(row.gstin, 'GSTR3B', st as GstReturnStatus)
            "
          />
          <span v-else>N/A</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column align="center" label="GSTR9">
      <el-table-column label="Tax period" min-width="90">
        <template #default="{ row }">
          <span v-if="row.gstr9">{{
            dayjs(row.gstr9?.returnPeriod, 'MMYYYY').format('MMM YYYY')
          }}</span>
          <span v-else>N/A</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" min-width="170">
        <template #default="{ row }">
          <GstStatus
            v-if="row.gstr9"
            :gst="row"
            :type="'gstr9'"
            @status-change="
              (st: string) =>
                updateStatus(row.gstin, 'GSTR9', st as GstReturnStatus)
            "
          />
          <span v-else>N/A</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column align="center" label="GSTR-2">
      <el-table-column label="Tax period" min-width="90">
        <template #default="{ row }">
          <span v-if="row.gstr2">{{
            dayjs(row.gstr2?.returnPeriod, 'MMYYYY').format('MMM YYYY')
          }}</span>
          <span v-else>N/A</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" min-width="170">
        <template #default="{ row }">
          <GstStatus
            v-if="row.gstr2"
            :gst="row"
            :type="'gstr2'"
            @status-change="
              (st: string) =>
                updateStatus(row.gstin, 'GSTR2', st as GstReturnStatus)
            "
          />
          <span v-else>N/A</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column prop="name" min-width="200" label="Owner" />
    <el-table-column prop="tradeName" min-width="200" label="Trade name" />
    <el-table-column label="Address">
      <el-table-column prop="permenantAddress.doorNo" label="Door no" />
      <el-table-column prop="permenantAddress.street" label="Street" />
      <el-table-column prop="permenantAddress.pincode" />
    </el-table-column>
    <el-table-column fixed="right" align="center" min-width="50">
      <template #default="scope">
        <GstRowActions
          :gst="scope.row"
          @action-click="onAction"
          @unlock-click="unlockRow"
        />
      </template>
    </el-table-column>
  </el-table>
  <BasePagination
    v-model:page="currentPage"
    v-model:limit="pageSize"
    :total="gsts?.totalRows"
    @pagination="paginateTable"
  />
</template>

<style lang="scss">
.el-table .error-row {
  --el-table-tr-bg-color: var(--el-color-error-light-3);

  > :not(.el-table-fixed-column--right) {
    pointer-events: none;
  }
}

.el-col {
  margin-right: 8px;

  &:last-of-type {
    margin-right: 0;
  }
}
</style>

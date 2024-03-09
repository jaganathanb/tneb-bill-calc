<script lang="ts" setup>
import { Plus, Refresh } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElButton } from 'element-plus'
import { storeToRefs } from 'pinia'

import { useGstsStore } from '@/stores'
import { useDDialog } from '@/stores/dialog.store'
import { useFeedbackStore } from '@/stores/feedback.store'

import { UploadGst } from '.'

const gstStore = useGstsStore()
const feedback = useFeedbackStore()
const dialog = useDDialog()

const { gsts, loading } = storeToRefs(gstStore)

const search = ref('')
const pageSize = ref(2)
const currentPage = ref(1)

const add = () => {
  const createGsts = async (gstins: string) => {
    await gstStore.createByIds(gstins.split(',').map((s) => s.trim()))

    dialog.close()
  }

  dialog.open({ title: 'Add GST', data: { gstins: '' } }, [
    { label: 'Cancel', type: 'danger', callback: () => dialog.close() },
    { label: 'Submit', callback: (data) => createGsts(data.gstins) }
  ])
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
      await gstStore.deleteById(data.gstin)
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
  //currentPage.value = page

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
})
</script>

<template>
  <d-dialog :view="UploadGst" />
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
            :type="'GSTR1'"
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
            :type="'GSTR3B'"
            @status-change="
              (st: string) =>
                updateStatus(row.gstin, 'GSTR3B', st as GstReturnStatus)
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
            :type="'GSTR2'"
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

<script lang="ts" setup>
import { Plus, Refresh } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElButton } from 'element-plus'
import { storeToRefs } from 'pinia'
import { settings } from 'nprogress'
import { AgGridVue } from '@ag-grid-community/vue3'

import BasePagination from '@/components/table/base-pagination.vue'
import { PAGE_LIMIT } from '@/constants'
import { useGstsStore } from '@/stores/gsts.store'
import { useDDialog } from '@/stores/dialog.store'
import { useFeedbackStore } from '@/stores/feedback.store'
import { useNotificationStore } from '@/stores/notification.store'
import { StatusEditor } from '@/components/table'
import StatusRenderer from '@/components/table/status-renderer.vue'

import GstRowActions from './gst-row-actions.vue'
import GstStatistics from './gst-statistics.vue'
import GstStatus from './gst-status.vue'

import { UploadGst } from '.'

import type { AxiosError } from 'axios'
import type {
  ColDef,
  ColGroupDef,
  DetailGridInfo,
  GridApi,
  GridOptions
} from '@ag-grid-community/core'

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

const themeClass = 'ag-theme-quartz-dark'

const columnDefs = [
  { field: 'gstin', headerName: 'Gstin', filter: true },
  { field: 'mobileNumber', headerName: 'Mobile number', filter: true },
  { field: 'name', headerName: 'Customer name', filter: true },
  { field: 'tradeName', headerName: 'Trade name', filter: true },
  {
    headerName: 'GSTR-1',
    children: [
      {
        field: 'gstr1.returnPeriod',
        filter: true,
        headerName: 'Tax period'
      },
      {
        field: 'gstr1.status',
        filter: true,
        editable: false,
        cellRenderer: StatusRenderer,
        cellRendererParams: { type: 'gstr1' },
        headerName: 'Status'
      }
    ]
  },
  {
    headerName: 'GSTR-3B',
    children: [
      {
        field: 'gstr3b.returnPeriod',
        filter: true,
        headerName: 'Tax period'
      },
      {
        field: 'gstr3b.status',
        filter: true,
        editable: false,
        cellRenderer: StatusRenderer,
        cellRendererParams: { type: 'gstr3b' },
        headerName: 'Status'
      }
    ]
  },
  {
    headerName: 'GSTR-2',
    children: [
      {
        field: 'gstr2.returnPeriod',
        filter: true,
        headerName: 'Tax period'
      },
      {
        field: 'gstr2.status',
        filter: true,
        editable: false,
        cellRenderer: StatusRenderer,
        cellRendererParams: { type: 'gstr2' },
        headerName: 'Status'
      }
    ]
  },
  {
    headerName: 'GSTR-9',
    children: [
      {
        field: 'gstr9.returnPeriod',
        filter: true,
        headerName: 'Tax period'
      },
      {
        field: 'gstr9.status',
        filter: true,
        editable: false,
        cellRenderer: StatusRenderer,
        cellRendererParams: { type: 'gstr9' },
        headerName: 'Status'
      }
    ]
  }
] as ColGroupDef<GstMap>[]

let gridApi: GridApi<GstMap>

const defaultColDefinition = {
  flex: 1,
  minWidth: 100
}

const options = {
  columnDefs,
  rowData: undefined,
  defaultColDef: defaultColDefinition,
  pagination: true,
  onColumnResized: () => saveColumnState(),
  onSortChanged: () => saveColumnState(),
  onColumnMoved: () => saveColumnState()
} as GridOptions<GstMap>

const onGridReady = ({ api }: DetailGridInfo) => {
  gridApi = api as GridApi<GstMap>

  const colState = localStorage.getItem('grid_col_state')
  if (colState) {
    gridApi.applyColumnState({ state: JSON.parse(colState), applyOrder: true })
  }
}

const saveColumnState = () => {
  localStorage.setItem(
    'grid_col_state',
    JSON.stringify(gridApi.getColumnState())
  )
}

watch(gsts, () => {
  gridApi?.setGridOption('rowData', gsts.value?.items)
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
  <ag-grid-vue
    style="width: 100%; height: calc(100% - 63px)"
    :class="themeClass"
    :grid-options="options"
    @grid-ready="onGridReady"
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

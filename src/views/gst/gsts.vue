<script lang="ts" setup>
import { AgGridVue } from '@ag-grid-community/vue3'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { useDark } from '@vueuse/core'
import { ElButton, dayjs } from 'element-plus'
import { storeToRefs } from 'pinia'
import {
  type ColDef,
  type ColGroupDef,
  type DetailGridInfo,
  type GetRowIdParams,
  type GridApi,
  type GridOptions
} from '@ag-grid-community/core'

import StatusRenderer from '@/components/table/status-renderer.vue'
import { useDDialog } from '@/stores/dialog.store'
import { useFeedbackStore } from '@/stores/feedback.store'
import { useGstsStore } from '@/stores/gsts.store'
import { useNotificationStore } from '@/stores/notification.store'
import StatusEditor from '@/components/table/status-editor.vue'

import GstStatistics from './gst-statistics.vue'
import GstRowActions from './gst-row-actions.vue'

import { UploadGst } from '.'

import type { AxiosError } from 'axios'

const gstStore = useGstsStore()
const feedback = useFeedbackStore()
const notiStore = useNotificationStore()
const dialog = useDDialog()
const isDark = useDark()

const { gsts, statistics } = storeToRefs(gstStore)
const { notification } = storeToRefs(notiStore)
const { inProgress } = storeToRefs(dialog)

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
      const locked = await gstStore.updateLockById(data.data.gstin, true)
      if (locked) {
        data.data.locked = true
        const rowNode = gridApi.getRowNode(data.data.gstin)!
        rowNode.setData(data.data)
      }

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
    pageNumber: gridApi.paginationGetCurrentPage() + 1,
    pageSize: gridApi.paginationGetPageSize()
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

const unlockRow = async (data: GstMap) => {
  const locked = await gstStore.updateLockById(data.gstin, false)
  if (locked) {
    data.locked = false
    const rowNode = gridApi.getRowNode(data.gstin)!
    rowNode.setData(data)
  }
}

onMounted(async () => {
  await gstStore.getAll({
    pageNumber: 1
  } as PagingRequest)

  await gstStore.getGstStatistics()
})

const themeClass = computed(() =>
  isDark.value ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'
)

const columnDefs = [
  { field: 'gstin', headerName: 'Gstin', filter: true },
  { field: 'mobileNumber', headerName: 'Mobile number', filter: true },
  { field: 'sno', headerName: 'S. No', filter: true },
  { field: 'fno', headerName: 'F. No', filter: true },
  { field: 'name', headerName: 'Customer name', filter: true, pinned: true },
  {
    field: 'tradeName',
    headerName: 'Trade name',
    filter: true,
    pinned: true
  },
  {
    headerName: 'GSTR-1',
    children: [
      {
        field: 'gstr1.returnPeriod',
        filter: true,
        headerName: 'Tax period',
        valueFormatter: (parameters) =>
          parameters.data?.gstr1
            ? dayjs(parameters.data?.gstr1?.returnPeriod, 'MMYYYY').format(
                'MMM YYYY'
              )
            : 'N/A'
      },
      {
        field: 'gstr1.status',
        filter: true,
        editable: true,
        cellRenderer: StatusRenderer,
        cellRendererParams: { type: 'gstr1' },
        cellEditor: StatusEditor,
        cellEditorParams: {
          type: 'gstr1',
          statusChanged: (
            gstin: string,
            type: GSTReturnType,
            status: GstReturnStatus
          ) => updateStatus(gstin, type, status)
        },
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
        headerName: 'Tax period',
        valueFormatter: (parameters) =>
          parameters.data?.gstr1
            ? dayjs(parameters.data?.gstr1?.returnPeriod, 'MMYYYY').format(
                'MMM YYYY'
              )
            : 'N/A'
      },
      {
        field: 'gstr3b.status',
        filter: true,
        editable: true,
        cellRenderer: StatusRenderer,
        cellRendererParams: {
          type: 'gstr3b'
        },
        cellEditor: StatusEditor,
        cellEditorParams: {
          type: 'gstr3b',
          statusChanged: (
            gstin: string,
            type: GSTReturnType,
            status: GstReturnStatus
          ) => updateStatus(gstin, type, status)
        },
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
        headerName: 'Tax period',
        valueFormatter: (parameters) =>
          parameters.data?.gstr1
            ? dayjs(parameters.data?.gstr1?.returnPeriod, 'MMYYYY').format(
                'MMM YYYY'
              )
            : 'N/A'
      },
      {
        field: 'gstr2.status',
        filter: true,
        editable: true,
        cellRenderer: StatusRenderer,
        cellRendererParams: {
          type: 'gstr2'
        },
        cellEditor: StatusEditor,
        cellEditorParams: {
          type: 'gstr2',
          statusChanged: (
            gstin: string,
            type: GSTReturnType,
            status: GstReturnStatus
          ) => updateStatus(gstin, type, status)
        },
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
        headerName: 'Tax period',
        valueFormatter: (parameters) =>
          parameters.data?.gstr1
            ? dayjs(parameters.data?.gstr1?.returnPeriod, 'MMYYYY').format(
                'MMM YYYY'
              )
            : 'N/A'
      },
      {
        field: 'gstr9.status',
        filter: true,
        editable: true,
        cellRenderer: StatusRenderer,
        cellRendererParams: {
          type: 'gstr9'
        },
        cellEditor: StatusEditor,
        cellEditorParams: {
          type: 'gstr9',
          statusChanged: (
            gstin: string,
            type: GSTReturnType,
            status: GstReturnStatus
          ) => updateStatus(gstin, type, status)
        },
        headerName: 'Status'
      }
    ]
  },
  { field: 'username', headerName: 'Username', filter: true },
  { field: 'password', headerName: 'Password' },
  {
    headerName: 'Actions',
    cellRenderer: GstRowActions,
    cellRendererParams: {
      onAction: (action: string, data: GstMap) => onAction({ action, data }),
      onUnlockAction: (data: GstMap) => unlockRow(data)
    },
    cellStyle: () => ({ display: 'flex', 'justify-content': 'center' })
  }
] as (ColDef<GstMap> | ColGroupDef<GstMap>)[]

let gridApi: GridApi<GstMap>

const defaultColDefinition = {}

const options = {
  columnDefs,
  rowData: undefined,
  defaultColDef: defaultColDefinition,
  pagination: true,
  paginationPageSize: 20,
  columnHoverHighlight: true,
  rowClassRules: {
    'locked-row': (parameters) => parameters.data?.locked
  },
  getRowId: (parameters: GetRowIdParams<GstMap>) => parameters.data.gstin,
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
.locked-row {
  background-color: var(--el-color-error-light-3);

  > :not(.ag-column-last) {
    pointer-events: none;
  }
}
</style>

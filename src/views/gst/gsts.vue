<script lang="ts" setup>
import { Plus, Refresh } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElButton } from 'element-plus'
import { storeToRefs } from 'pinia'

import { useGstsStore } from '@/stores'
import { useFeedbackStore } from '@/stores/feedback.store'

import { GstStatus } from '.'

const gstStore = useGstsStore()
const feedback = useFeedbackStore()

const { gsts, loading } = storeToRefs(gstStore)

// const r1StatusOptions = [
//   {
//     label: 'Call for invoice', // Tax payable
//     icon: Phone,
//     color: 'blue',
//     value: 1
//   },
//   {
//     label: 'Invoice received', // Intimated
//     icon: DocumentChecked,
//     color: 'orange',
//     value: 2
//   },
//   {
//     label: 'Entry done', // Amount received
//     icon: Memo,
//     color: 'lightBlue',
//     value: 3
//   },
//   {
//     label: 'Filed',
//     icon: Select,
//     color: 'green',
//     value: 4
//   }
// ] as StatusDropdownItem[]

const search = ref('')

const add = async () => {
  try {
    const result = await feedback.getConfirmation({
      boxType: 'prompt',
      confirmButtonText: 'Add',
      inputType: 'textarea',
      showInput: true,
      inputPlaceholder: 'Enter GST number here',
      title: 'Add GST',
      closeOnPressEscape: true,
      closeOnClickModal: false
    })

    if (result.action === 'confirm') {
      await gstStore.createByIds(
        result.value
          .trim()
          .split(',')
          .map((a) => a.trim())
      )
    }
  } catch {}
}

// const deleteGST = async (data: Gst) => {
//   try {
//     const result = (await feedback.getConfirmation({
//       message: h('p', undefined, [
//         h('span', undefined, 'Are you sure want to delete the GST '),
//         h('i', { style: 'color: red; font-weight: 600' }, data.gstin),
//         h('span', undefined, ' from system?')
//       ]),
//       boxType: 'confirm',
//       confirmButtonText: 'Yes',
//       cancelButtonText: 'No',
//       showCancelButton: true,
//       title: 'Confirm'
//     })) as string

//     if (result === 'confirm') {
//       await gstStore.deleteById(data.gstin)
//     }

//     feedback.setMessage({ message: 'Delete successfully!', type: 'success' })
//   } catch {}
// }

// const onAction = async ({ action, data }: { action: string; data: Gst }) => {
//   switch (action) {
//     case 'view':
//     case 'edit': {
//       feedback.setMessage({
//         message:
//           'This action is not supported yet!. Please contact administrator.',
//         type: 'warning'
//       })
//       break
//     }
//     case 'lock': {
//       data.locked = true
//       await gstStore.updateById(data)
//       break
//     }
//     case 'delete': {
//       await deleteGST(data)
//     }
//     default: {
//       break
//     }
//   }
// }

const refreshPage = async () => {
  await gstStore.getAll({} as PagingRequest)
}

const updateStatus = async (data: {
  data: GstMap
  type: GSTReturnType
  status: GstReturnStatus
}) => {
  switch (data.type) {
    case 'GSTR1': {
      data.data = {
        ...data.data,
        gstr1: {
          ...data.data.gstr1,
          status
        }
      } as GstMap
      break
    }
    case 'GSTR3B': {
      data.data = {
        ...data.data,
        gstr3bLastStatus: data.status
      } as GstMap
      break
    }
    default: {
      break
    }
  }

  await gstStore.updateReturnStatusById(data.data.gstin, data.type, data.status)
}

// const movePage = async (page: number) => {
//   currentPage.value = page

//   await gstStore.getAll({} as PagingRequest)
// }

// const changePageSize = async (size: number) => {
//   loading.value = true

//   pageSize.value = size

//   await gstStore.getAll({} as PagingRequest)
// }

// const lockRow = ({ row }: { row: GST }) => {
//   if (row.locked) {
//     return 'error-row'
//   }

//   return ''
// }

// const unlockRow = async (data: Gst) => {
//   data.locked = false
//   await gstStore.updateById(data)
// }

const onSearch = (event_: KeyboardEvent | Event) => {
  if (event_ instanceof KeyboardEvent && event_.key === 'Enter') {
    gstStore.getAll({} as PagingRequest)
  }
}

onMounted(async () => {
  await gstStore.getAll({} as PagingRequest)
})
</script>

<template>
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
  <el-table v-loading="loading" :data="gsts?.items">
    <el-table-column prop="gstin" width="150" label="GSTIN" fixed>
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
      <el-table-column label="Tax period" width="90">
        <template #default="{ row }">
          {{ dayjs(row.gstr1.returnPeriod, 'MMYYYY').format('MMM YYYY') }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="170" align="center">
        <template #default="{ row }">
          <GstStatus
            :gst="row"
            :type="'GSTR1'"
            @status-change="
              (st: string) =>
                updateStatus({
                  data: row,
                  status: st as GstReturnStatus,
                  type: 'GSTR1'
                })
            "
          />
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column align="center" label="GSTR-3B">
      <el-table-column label="Tax period" width="90">
        <template #default="{ row }">
          {{ dayjs(row.gstr3b.returnPeriod, 'MMYYYY').format('MMM YYYY') }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="170" align="center">
        <template #default="{ row }">
          <GstStatus
            :gst="row"
            :type="'GSTR3B'"
            @status-change="
              (st: string) =>
                updateStatus({
                  data: row,
                  status: st as GstReturnStatus,
                  type: 'GSTR3B'
                })
            "
          />
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
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

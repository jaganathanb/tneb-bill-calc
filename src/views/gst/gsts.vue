<script lang="ts" setup>
import { useFeedbackStore } from '@/stores/feedback.store'
import {
  Delete,
  DocumentChecked,
  Edit,
  Lock,
  Memo,
  More,
  Phone,
  Plus,
  Refresh,
  Select,
  Tickets,
  Unlock,
  Warning
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElButton, ElStatistic } from 'element-plus'
import { storeToRefs } from 'pinia'
import ReturnStatusCell from './return-status-cell.vue'
import type { OptionType } from 'element-plus/es/components/select-v2/src/select.types'
import { useGstsStore } from '@/stores'

type StatusDropdownItem = OptionType & {
  icon: VNode | Component
  color: string
}

const gstStore = useGstsStore()
const feedback = useFeedbackStore()

const { gsts } = storeToRefs(gstStore)

const r1StatusOptions = [
  {
    label: 'Call for invoice', // Tax payable
    icon: Phone,
    color: 'blue',
    value: 1
  },
  {
    label: 'Invoice received', // Intimated
    icon: DocumentChecked,
    color: 'orange',
    value: 2
  },
  {
    label: 'Entry done', // Amount received
    icon: Memo,
    color: 'lightBlue',
    value: 3
  },
  {
    label: 'Filed',
    icon: Select,
    color: 'green',
    value: 4
  }
] as StatusDropdownItem[]

const progress = ref(true)
const search = ref('')
const currPage = ref(1)
const dialogVisible = ref(false)
const selectedGST = ref({} as GST)

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
  } catch (error) {}
}

const deleteGST = async (data: Gst) => {
  try {
    const result = (await feedback.getConfirmation({
      message: h('p', null, [
        h('span', null, 'Are you sure want to delete the GST '),
        h('i', { style: 'color: red; font-weight: 600' }, data.gstin),
        h('span', null, ' from system?')
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
  } catch (error) {}
}

const onAction = async ({ action, data }: { action: string; data: Gst }) => {
  switch (action) {
    case 'view':
    case 'edit':
      feedback.setMessage({
        message:
          'This action is not supported yet!. Please contact administrator.',
        type: 'warning'
      })
      break
    case 'lock':
      data.locked = true
      await gstStore.updateById(data)
      break
    case 'delete':
      await deleteGST(data)
    default:
      break
  }
}

const refreshPage = async () => {
  await gstStore.getAll({} as PagingRequest)
}

const updateStatus = async (data: {
  data: Gst
  type: GSTReturnType
  status: number
}) => {
  switch (data.type) {
    case 'GSTR1':
      data.data = {
        ...data.data,
        gstr1LastStatus: data.status
      } as Gst
      break
    case 'GSTR3B':
      data.data = {
        ...data.data,
        gstr3bLastStatus: data.status
      } as Gst
    default:
      break
  }

  await gstStore.updateById(data.data)
}

const movePage = async (page: number) => {
  await gstStore.getAll({} as PagingRequest)
}

const changePageSize = async (size: number) => {
  progress.value = true
  
  await gstStore.getAll({} as PagingRequest)
}

const lockRow = ({ row }: { row: GST }) => {
  if (row.locked) {
    return 'error-row'
  }

  return ''
}

const unlockRow = async (data: Gst) => {
  data.locked = false
  await gstStore.updateById(data)
}

const onSearch = (evt: KeyboardEvent | Event) => {
  if (evt instanceof KeyboardEvent && evt.key === 'Enter') {
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
        @click="add"
        style="margin-bottom: 8px"
      >
        Add
      </el-button>
      <el-tooltip content="Refresh">
        <el-button
          :icon="Refresh"
          @click="refreshPage"
          style="margin-bottom: 8px"
        >
        </el-button>
      </el-tooltip>
    </el-row>
  </el-container>
  <el-table
    :data="gsts?.items"
    v-loading="progress"
    :border="true"
    style="width: 100%"
    :row-class-name="lockRow"
  >
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
      <el-table-column
        label="Tax period"
        prop="gstr1LastFiledTaxPeriod"
        width="90"
      >
        <template #default="{ row }">
          {{ dayjs(row.gstr1LastFiledTaxPeriod, 'MMYYYY').format('MMM YYYY') }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="170" align="center">
        <template #default="{ row }">
          <el-dropdown
            trigger="click"
            :class="{
              'pointer-events-none': row.gstr1LastStatus === 4,
              'cursor-pointer': row.gstr1LastStatus !== 4
            }"
            placement="right-start"
            @command="updateStatus"
          >
            <span class="el-dropdown-link flex">
              <return-status-cell
                :gst="row"
                :type="'GSTR1'"
              ></return-status-cell>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :command="{ status: opt.value, data: row, type: 'GSTR1' }"
                  v-for="opt of r1StatusOptions"
                  :disabled="opt.value === 4"
                >
                  <el-icon
                    size="18"
                    :color="opt.color"
                    style="margin-right: 8px"
                    ><component :is="opt.icon"></component></el-icon
                  ><el-text>{{ opt.label }}</el-text>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-tooltip
            :content="`There are ${
              row.gstr1PendingReturns?.length
            } pending returns. ${(row.gstr1PendingReturns || [])
              .map((d: string) => dayjs(d, 'MMYYYY').format('MMM YYYY'))
              .join(',')}`"
          >
            <el-icon size="18" style="margin-left: 8px">
              <Warning />
            </el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column align="center" label="GSTR-3B">
      <el-table-column label="Tax period" width="90">
        <template #default="{ row }">
          {{ dayjs(row.gstr3bLastFiledTaxPeriod, 'MMYYYY').format('MMM YYYY') }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="170" align="center">
        <template #default="{ row }">
          <el-dropdown
            trigger="click"
            class="cursor-pointer"
            placement="right-start"
            @command="updateStatus"
          >
            <span class="el-dropdown-link flex">
              <return-status-cell
                :gst="row"
                :type="'GSTR3B'"
              ></return-status-cell>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :command="{ status: opt.value, data: row, type: 'GSTR3B' }"
                  v-for="opt of r1StatusOptions"
                  :disabled="opt.value === 4"
                >
                  <el-icon
                    size="18"
                    :color="opt.color"
                    style="margin-right: 8px"
                    ><component :is="opt.icon"></component></el-icon
                  ><el-text>{{ opt.label }}</el-text>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-tooltip
            :content="`There are ${
              row.gstr3bPendingReturns?.length
            } pending returns. ${(row.gstr3bPendingReturns || [])
              .map((d: string) => dayjs(d, 'MMYYYY').format('MMM YYYY'))
              .join(',')}`"
          >
            <el-icon size="18" style="margin-left: 8px">
              <Warning />
            </el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column prop="owner" width="200" label="Owner" />
    <el-table-column prop="tradename" width="200" label="Trade name" />
    <el-table-column prop="address" label="Address" />
    <el-table-column fixed="right" align="center" width="50">
      <template #default="scope">
        <el-tooltip
          :content="scope.row.locked ? 'Unlock' : 'Actions'"
          placement="top"
        >
          <el-dropdown
            v-if="!scope.row.locked"
            trigger="click"
            @command="onAction"
          >
            <el-button :icon="More" link></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="{ action: 'view', data: scope.row }"
                  ><el-icon size="16" color=""><Tickets /></el-icon
                  ><el-text>View returns</el-text></el-dropdown-item
                >
                <el-dropdown-item :command="{ action: 'edit', data: scope.row }"
                  ><el-icon size="16"><Edit /></el-icon
                  ><el-text>Edit</el-text></el-dropdown-item
                >
                <el-dropdown-item :command="{ action: 'lock', data: scope.row }"
                  ><el-icon size="16"><Lock /></el-icon
                  ><el-text>Lock</el-text></el-dropdown-item
                >
                <el-dropdown-item
                  divided
                  :command="{ action: 'delete', data: scope.row }"
                  ><el-icon size="16" color="red"><Delete /></el-icon
                  ><el-text>Delete</el-text>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button
            v-else
            :icon="Unlock"
            link
            @click="() => unlockRow(scope.row)"
          ></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
  <BasePagination
    v-model:page="currPage"
    v-model:limit="gsts?.totalPages"
    :total="gsts?.totalRows"
    @update:limit="changePageSize"
    @update:page="movePage"
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

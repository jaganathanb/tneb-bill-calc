<script lang="ts" setup>
import { useGSTsStore } from '@/stores/gsts.store_1'

import { ElButton, ElTag } from 'element-plus'
import {
  Plus,
  Edit,
  Delete,
  More,
  Remove,
  DocumentDelete,
  Tickets,
  Check,
  Phone,
  Lock,
  DocumentChecked,
  Memo,
  Select,
  Refresh,
  Warning
} from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { PAGE_LIMIT } from '@/constants'
import BasePagination from '@/components/table/base-pagination.vue'
import { useHttpClient } from '@/hooks'
import GSTReturns from './gst-returns.vue'
import { useFeedbackStore } from '@/stores/feedback.store'
import GSTEdit from './gst-edit.vue'
import type { OptionType } from 'element-plus/es/components/select-v2/src/select.types'
import { ReturnStatusCell } from './index'
import dayjs from 'dayjs'

type StatusDropdownItem = OptionType & {
  icon: Component
  color: string
}

const gstStore = useGSTsStore()
const feedback = useFeedbackStore()
const httpClient = useHttpClient()

const { gsts, gstsReturns, totalGSTs } = storeToRefs(gstStore)

const loading = ref(false)

const params = reactive<Params>({
  move: 'next',
  page: 1,
  limit: PAGE_LIMIT,
  sort: 'registrationDate',
  order: 'desc'
})

const isOpen = ref(false)
const selectedGST: Ref<GST> = ref({} as GST)

const dialogVisible = ref(false)
const dialogTitle = ref(`Edit ${selectedGST.value.gstin}`)
const gstr1Status: Ref<StatusDropdownItem[]> = ref([
  {
    label: 'Call for invoice',
    icon: Phone,
    color: '',
    value: 1
  }
] as StatusDropdownItem[])
const gstr1StatusOptions = [
  {
    label: 'Call for invoice',
    icon: Phone,
    color: '',
    value: 1
  },
  {
    label: 'Invoice received',
    icon: DocumentChecked,
    color: 'orange',
    value: 2
  },
  {
    label: 'Entry done',
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

const currGsts = computed(() => {
  return gsts.value?.[params.page] as GST[]
})

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
      await gstStore.getGSTDetail(result.value.trim(), params)
      loading.value = false
    }
  } catch (error) {
    loading.value = false
  }
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
      message: `Are you sure want to delete the GST ${data.gstin} from system?`,
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

const updateGST = () => {
  dialogVisible.value = false
}

const onAction = async ({ action, data }: { action: string; data: GST }) => {
  switch (action) {
    case 'view':
    case 'edit':
      selectedGST.value = data
      dialogVisible.value = true
      break
    case 'delete':
      await deleteGST(data)
    default:
      break
  }
}

const updateStatus = async (data: {
  data: GST
  type: GSTReturnType
  status: number
}) => {
  loading.value = true

  switch (data.type) {
    case 'GSTR1':
      data.data = {
        ...data.data,
        gstr1LastStatus: data.status
      } as GST
      break
    case 'GSTR3B':
      data.data = {
        ...data.data,
        gstr3bLastStatus: data.status
      } as GST
    default:
      break
  }

  await gstStore.setGST(data.data, params)

  loading.value = false
}

const refreshPage = async () => {
  loading.value = true
  await gstStore.refresh(params.page)
  loading.value = false
}
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle">
    <el-row>
      <el-col>
        <label for="gstr1_status">GSTR-1 status:</label>
        <el-select-v2
          v-model="gstr1Status"
          filterable
          :options="gstr1StatusOptions"
          placeholder="Please select return status"
          style="width: 240px"
          multiple
        >
          <template #default="{ item }">
            <el-icon size="18" :color="item.color" style="margin-right: 8px"
              ><component :is="item.icon"></component></el-icon
            ><el-text>{{ item.label }}</el-text>
          </template>
        </el-select-v2>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateGST"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
  <el-container class="w-full">
    <el-row class="w-full flex-justify-between">
      <el-button
        type="primary"
        :icon="Plus"
        @click="toAdd"
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
    :data="currGsts"
    :border="true"
    v-loading="loading"
    style="width: 100%"
  >
    <el-table-column
      prop="gstin"
      width="150"
      label="GSTIN"
      fixed
    ></el-table-column
    >>
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
            trigger="contextmenu"
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
                  v-for="opt of gstr1StatusOptions"
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
              row.gstr1PendingReturns.length
            } pending returns. ${row.gstr1PendingReturns
              .map((d: string) => dayjs(d, 'MMYYYY').format('MMM YYYY'))
              .join(',')}`"
          >
            <el-icon size="18" style="margin-left: 8px; cursor: pointer">
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
            trigger="contextmenu"
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
                  v-for="opt of gstr1StatusOptions"
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
              row.gstr3bPendingReturns.length
            } pending returns. ${row.gstr3bPendingReturns
              .map((d: string) => dayjs(d, 'MMYYYY').format('MMM YYYY'))
              .join(',')}`"
          >
            <el-icon size="18" style="margin-left: 8px; cursor: pointer">
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
        <el-tooltip content="Actions" placement="top">
          <el-dropdown trigger="click" @command="onAction">
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
        </el-tooltip>
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
</template>

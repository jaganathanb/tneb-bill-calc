<script setup lang="ts">
import { DocumentChecked, Memo, Phone, Select } from '@element-plus/icons-vue'

import ReturnStatusCell from '@/views/gst/return-status-cell.vue'

import type { ICellEditorParams } from '@ag-grid-community/core'
import type { PropType } from 'vue'

const properties = defineProps({
  params: {
    type: Object as PropType<
      ICellEditorParams<GstMap, GstMap, any> & {
        type: GSTReturnTypeLowered
        statusChanged: (
          gstin: string,
          type: GSTReturnType,
          status: GstReturnStatus
        ) => void
      }
    >
  }
})

interface StatusDropdownItem {
  icon: VNode | Component
  color: string
  label: string
  value: any
}

const gstr1StatusOptions = [
  {
    label: 'Call for invoice',
    icon: Phone,
    color: 'blue',
    value: 'CallForInvoice'
  },
  {
    label: 'Invoice received',
    icon: DocumentChecked,
    color: 'orange',
    value: 'InvoiceReceived'
  },
  {
    label: 'Entry done',
    icon: Memo,
    color: 'lightBlue',
    value: 'InvoiceEntry'
  },
  {
    label: 'Filed',
    icon: Select,
    color: 'green',
    value: 'Filed'
  }
] as StatusDropdownItem[]

const gst3bStatusOptions = [
  {
    label: 'Tax payable',
    icon: Phone,
    color: 'blue',
    value: 'TaxPayable'
  },
  {
    label: 'Customer intimated',
    icon: DocumentChecked,
    color: 'orange',
    value: 'CustomerIntimated'
  },
  {
    label: 'Tax amount received',
    icon: Memo,
    color: 'lightBlue',
    value: 'TaxAmountReceived'
  },
  {
    label: 'Filed',
    icon: Select,
    color: 'green',
    value: 'Filed'
  }
] as StatusDropdownItem[]

const statusOptions =
  properties?.params?.type === 'gstr1' ? gstr1StatusOptions : gst3bStatusOptions

let statusOption =
  statusOptions.find((s) => s.value === properties.params?.value) ??
  statusOptions[0]

const dropdown1 = ref<any>()

const onItemChange = (value: string) => {
  statusOption = statusOptions.find(
    (s) => s.value === value
  ) as StatusDropdownItem

  properties.params?.statusChanged(
    properties.params.data.gstin,
    properties.params.type.toUpperCase() as GSTReturnType,
    statusOption.value
  )
  properties.params?.stopEditing()
}

const getValue = () => {
  return statusOption.value
}

onMounted(async () => {
  await nextTick(() => {
    statusOption =
      statusOptions.find((s) => s.value === properties.params?.value) ??
      statusOptions[0]

    if (dropdown1) {
      dropdown1.value?.toggleMenu()
    }
  })
})
</script>

<template>
  <el-container>
    <el-select
      ref="dropdown1"
      v-model="statusOption.value"
      @change="onItemChange"
    >
      <template #label="stOpt = statusOption">
        <ReturnStatusCell :return-status="stOpt" />
      </template>
      <el-option
        v-for="item in statusOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.value === 'Filed'"
      >
        <ReturnStatusCell :return-status="item" />
      </el-option>
    </el-select>
  </el-container>
</template>

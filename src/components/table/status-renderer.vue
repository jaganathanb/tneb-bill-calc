<script setup lang="ts">
import { DocumentChecked, Memo, Phone, Select } from '@element-plus/icons-vue'

import PendingReturnWarning from '@/views/gst/pending-return-warning.vue'
import ReturnStatusCell from '@/views/gst/return-status-cell.vue'

import type { ICellEditorParams } from '@ag-grid-community/core'
import type { PropType } from 'vue'
import type { DropdownInstance } from 'element-plus'

interface StatusDropdownItem {
  icon: VNode | Component
  color: string
  label: string
  value: any
}

const properties = defineProps({
  params: {
    type: Object as PropType<
      ICellEditorParams<GstMap, GstMap, any> & { type: GSTReturnTypeLowered }
    >
  }
})

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

const statusOption =
  statusOptions.find((s) => s.value === properties.params?.value) ??
  statusOptions[0]
</script>

<template>
  <el-container class="flex-items-center">
    <ReturnStatusCell :return-status="statusOption" />
    <PendingReturnWarning
      :gst-status="params?.data[params.type] ?? ({} as GstStatus)"
    />
  </el-container>
</template>

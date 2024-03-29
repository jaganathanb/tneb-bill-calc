<script setup lang="ts">
import { DocumentChecked, Memo, Phone, Select } from '@element-plus/icons-vue'

import { ReturnStatusCell } from '.'

import type { OptionType } from 'element-plus/es/components/select-v2/src/select.types'
import type { Component, PropType } from 'vue'

type StatusDropdownItem = OptionType & {
  icon: VNode | Component
  color: string
  value: any
}

const properties = defineProps({
  returnStatus: {
    type: Object as PropType<GstStatus>,
    required: true
  }
})

const emits = defineEmits<{ statusChange: [status: string] }>()

const gstr1StatusOptions = [
  {
    label: 'Call for invoice',
    icon: Phone,
    color: 'blue',
    value: 'InvoiceCall'
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
    value: 'EntryDone'
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
    value: 'Intimated'
  },
  {
    label: 'Tax amount received',
    icon: Memo,
    color: 'lightBlue',
    value: 'TaxPaid'
  },
  {
    label: 'Filed',
    icon: Select,
    color: 'green',
    value: 'Filed'
  }
] as StatusDropdownItem[]

let statusOptions = gstr1StatusOptions

onBeforeMount(() => {
  switch (properties.returnStatus.returnType) {
    case 'GSTR1': {
      statusOptions = gstr1StatusOptions
      break
    }
    case 'GSTR3B': {
      statusOptions = gst3bStatusOptions
      break
    }
    default: {
      break
    }
  }
})
</script>

<template>
  <el-dropdown
    trigger="click"
    :class="{
      'pointer-events-none': returnStatus.status === 'Filed',
      'cursor-pointer': returnStatus.status !== 'Filed'
    }"
    placement="right-start"
    @command="(status: string) => emits('statusChange', status)"
  >
    <span class="el-dropdown-link flex">
      <ReturnStatusCell
        :return-status="
          statusOptions.find((s) => s.value === returnStatus.status) ??
          statusOptions[0]
        "
      />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(opt, i) of statusOptions"
          :key="i"
          :command="opt.value"
          :disabled="opt.value === 'Filed'"
        >
          <ReturnStatusCell :return-status="opt" />
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

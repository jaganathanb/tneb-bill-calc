<script setup lang="ts">
import { type Component, type PropType, ref } from 'vue'

import { DocumentChecked, Memo, Phone, Select } from '@element-plus/icons-vue'

import type { OptionType } from 'element-plus/es/components/select-v2/src/select.types'

type GSTRStatus = {
  gstr1Status: string | undefined
  gstr3bStatus?: string | undefined
}

const properties = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  gst: {
    type: Object as PropType<GST>,
    required: true
  }
})

const emit = defineEmits<{
  (event: 'submit', value: GSTRStatus): void
  (event: 'cancel'): void
}>()

const dialogVisible = ref(false)
const dialogTitle = ref(`Edit ${properties.gst.gstin}`)
const gstr1Status = ref(undefined)
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
] as (OptionType & {
  icon: Component
  color: string
})[]

watch([properties.isOpen], (v) => {
  dialogVisible.value = v[0]
})
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
              ><component :is="item.icon" /></el-icon
            ><el-text>{{ item.label }}</el-text>
          </template>
        </el-select-v2>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('cancel')">Cancel</el-button>
        <el-button type="primary" @click="emit('submit', { gstr1Status })">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

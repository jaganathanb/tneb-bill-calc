<script lang="ts" setup>
import {
  Delete,
  Edit,
  Lock,
  More,
  Refresh,
  Tickets,
  Unlock
} from '@element-plus/icons-vue'

const properties = defineProps({
  gst: {
    type: Object as PropType<GstMap>,
    required: true
  }
})

const emits = defineEmits<{
  actionClick: [data: { action: string; data: GstMap }]
  unlockClick: [data: GstMap]
}>()

const canShowRefreshReturns = () => {
  const gst = properties.gst
  return (
    !(gst.gstr1 || gst.gstr2 || gst.gstr9 || gst.gstr3b) ||
    gst.gstr1.status === 'InvoiceEntry' ||
    gst.gstr3b.status === 'TaxPaid'
  )
}
</script>
<template>
  <el-tooltip :content="gst.locked ? 'Unlock' : 'Actions'" placement="top">
    <el-dropdown
      v-if="!gst.locked"
      trigger="click"
      @command="(data) => emits('actionClick', data)"
    >
      <el-button :icon="More" link />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :command="{ action: 'view', data: gst }"
            ><el-icon size="16" color=""><Tickets /></el-icon
            ><el-text>View returns</el-text></el-dropdown-item
          >
          <el-dropdown-item
            v-if="canShowRefreshReturns()"
            :command="{ action: 'refresh-returns', data: gst }"
            ><el-icon size="16" color=""><Refresh /></el-icon
            ><el-text>Refresh returns</el-text></el-dropdown-item
          >
          <el-dropdown-item :command="{ action: 'edit', data: gst }"
            ><el-icon size="16"><Edit /></el-icon
            ><el-text>Edit</el-text></el-dropdown-item
          >
          <el-dropdown-item :command="{ action: 'lock', data: gst }"
            ><el-icon size="16"><Lock /></el-icon
            ><el-text>Lock</el-text></el-dropdown-item
          >
          <el-dropdown-item divided :command="{ action: 'delete', data: gst }"
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
      @click="() => emits('unlockClick', gst)"
    />
  </el-tooltip>
</template>

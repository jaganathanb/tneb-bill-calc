<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

import type { PropType } from 'vue'

defineProps({
  gstStatus: {
    type: Object as PropType<GstStatus>,
    required: true
  }
})
</script>

<template>
  <el-tooltip
    :content="`There are ${
      gstStatus.pendingReturns?.length
    } pending returns. ${(gstStatus.pendingReturns || [])
      .map((d: string) => dayjs(d, 'MMYYYY').format('MMM YYYY'))
      .join(',')}`"
  >
    <el-icon size="18" style="margin-left: 8px">
      <Warning />
    </el-icon>
  </el-tooltip>
</template>

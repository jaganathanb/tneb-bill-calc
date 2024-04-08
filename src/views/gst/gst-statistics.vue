<script setup lang="ts">
import GstStatistic from './gst-statistic.vue'

defineProps({
  statistics: {
    type: Object as PropType<GstStatistics>,
    required: true
  }
})
</script>

<template>
  <el-container class="center justify-center">
    <gst-statistic
      :statistic="statistics.gstr1Count"
      title="GST - R1"
      :highlight="true"
    />

    <gst-statistic
      :statistic="statistics.gstr2Count"
      title="GST - R2"
      :highlight="true"
    />

    <gst-statistic
      :statistic="statistics.gstr9Count"
      title="GST - R9"
      :highlight="true"
    />

    <gst-statistic
      :statistic="statistics.gstr3bCount"
      title="GST - R3B"
      :highlight="true"
    />
  </el-container>
</template>

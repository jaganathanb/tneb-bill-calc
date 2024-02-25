<script lang="ts" setup>
import {
  ArcElement,
  type ChartData,
  Chart as ChartJS,
  Legend,
  Tooltip
} from 'chart.js'
import { Pie } from 'vue-chartjs'

import type { PropType } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)
ChartJS.defaults.plugins.legend.labels.usePointStyle = true
ChartJS.defaults.plugins.legend.labels.pointStyle = 'circle'

defineProps({
  data: {
    type: Object as PropType<ChartData<'pie', number[], unknown>>,
    required: true
  },
  options: Object
})
</script>

<template>
  <Pie :data="data" :options="options" />
</template>

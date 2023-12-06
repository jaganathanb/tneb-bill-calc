<script lang="ts" setup>
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  type ChartDataset
} from 'chart.js'
import type { PropType } from 'vue'
import { Chart, Pie } from 'vue-chartjs'

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

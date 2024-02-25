<script lang="ts" setup>
import { type PropType, ref } from 'vue'

import { Edit, More, Refresh, Remove } from '@element-plus/icons-vue'
import { type ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'

import { DPieChart } from '@/components/charts'

import type { OptionType } from 'element-plus/es/components/select-v2/src/select.types'

const properties = defineProps({
  card: {
    type: Object as PropType<DCard>,
    required: true
  }
})

//const { gstsReturns } = storeToRefs(gstStore)

const loading = ref(true)
const dialogVisible = ref(false)
const cardForm = reactive<{ duration: string }>({
  duration: '1'
})
const dateOptions: OptionType[] = [
  { label: 'Today', value: 0 },
  { label: 'Yesterday', value: 1 },
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
  { label: 'Last 365 days', value: 365 }
]
const duration = ref(1)

const data = computed(() => {
  const filedStatus = {
    gstr1Count: 1,
    gstr3bCount: 2,
    gstr9Count: 3
  }

  return {
    labels: ['GSTR1', 'GSTRB3', 'GSTR9'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
        data: [
          filedStatus.gstr1Count,
          filedStatus.gstr3bCount,
          filedStatus.gstr9Count
        ]
      }
    ]
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 2000
  }
}

const removeCard = async () => {
  loading.value = true

  loading.value = false
}

const refreshCard = async () => {
  loading.value = true

  // await gstStore.getGSTReturns(props.card.gstin)

  loading.value = false
}

const setDuration = () => {
  duration.value = Number.parseInt(cardForm.duration as string)
  dialogVisible.value = false
}

onMounted(async () => {
  // await gstStore.getGSTReturns(props.card.gstin)

  loading.value = false
})
</script>

<template>
  <el-dialog v-model="dialogVisible" title="Duration">
    <el-form :model="cardForm">
      <el-form-item label="Select duration" prop="duration">
        <el-select-v2
          v-model="cardForm.duration"
          :options="dateOptions"
          placeholder="Please select a duration"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="setDuration"> Add </el-button>
      </span>
    </template>
  </el-dialog>
  <el-card v-loading="loading" :shadow="'hover'">
    <template #header>
      <div class="card-header">
        <span>{{ properties.card.tradename }}</span>

        <el-dropdown trigger="click">
          <el-button :icon="More" link />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="Edit" @click="dialogVisible = true"
                >Configure</el-dropdown-item
              >
              <el-dropdown-item :icon="Refresh" @click="refreshCard">
                Refresh
              </el-dropdown-item>
              <el-dropdown-item :icon="Remove" @click="removeCard">
                Remove
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
    <el-container>
      <el-row align="middle" class="w-full" :justify="'center'">
        <el-col class="flex w-full justify-center">
          <DPieChart ref="piechart" :data="data" :options="options" />
        </el-col>
      </el-row>
    </el-container>
  </el-card>
</template>

<style scoped>
.count {
  font-size: 6rem;
}
</style>

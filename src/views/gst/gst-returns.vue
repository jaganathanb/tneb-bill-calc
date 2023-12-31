<script lang="ts" setup>
import { ElButton, dayjs } from 'element-plus'
import { Select, Timer } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { PAGE_LIMIT } from '@/constants'
import BasePagination from '@/components/table/base-pagination.vue'

import type { PropType } from 'vue'
import { useGSTsStore } from '@/stores/gsts.store'
import { useFeedbackStore } from '@/stores/feedback.store'

const gstStore = useGSTsStore()
const feedback = useFeedbackStore()

//const { gstsReturns } = storeToRefs(gstStore)

const loading = ref(false)

const params = reactive<Params>({
  move: 'next',
  sort: 'dof',
  order: 'desc',
  limit: PAGE_LIMIT,
  page: 1
})

const props = defineProps({
  gst: {
    type: Object as PropType<GST>,
    required: true
  },
  fetch: {
    type: Boolean,
    defaults: true
  }
})

const pagedGstsReturns = computed(() => {
  const start = params.limit * (params.page - 1)
  const end = start + params.limit

  return []
})

onMounted(async () => {
  if (![]) {
    loading.value = true
    //  await gstStore.getGSTReturns(props.gst.gstin)
    loading.value = false
  }
})
</script>

<template>
  <el-table
    :data="pagedGstsReturns"
    :border="true"
    v-loading="loading"
    style="width: 100%"
  >
    <el-table-column prop="ret_prd" :sortable="true" label="GST Month">
      <template #default="scope">
        <el-text>
          {{ dayjs(scope.row.ret_prd, 'MMYYYY').format('MMM YYYY') }}
        </el-text>
      </template>
    </el-table-column>
    <el-table-column prop="dof" type="date" :sortable="true" label="Filed date">
      <template #default="scope">
        <el-text>
          {{ dayjs(scope.row.dof, 'DD-MM-YYYY').format('DD MMM YYYY') }}
        </el-text>
      </template>
    </el-table-column>
    <el-table-column prop="rtntype" :sortable="true" label="Return type">
    </el-table-column>
    <el-table-column prop="status" label="Status">
      <template #default="scope">
        <el-space v-if="scope.row.status === 'Filed'">
          <el-icon :color="'green'"> <Select /></el-icon>
          Filed
        </el-space>
        <el-space v-else>
          <el-icon :color="'yellow'"><Timer /></el-icon>
          Pending
        </el-space>
      </template>
    </el-table-column>
  </el-table>
  <BasePagination
    v-model:page="params.page"
    v-model:limit="params.limit"
    :total="1"
  />
</template>

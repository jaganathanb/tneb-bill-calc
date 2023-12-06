<script lang="ts" setup>
import { PAGE_LIMIT } from '@/constants'
import { useGSTsStore, useCardsStore } from '@/stores'
import { Plus, Search } from '@element-plus/icons-vue'
import type { OptionType } from 'element-plus/es/components/select-v2/src/select.types'
import { storeToRefs } from 'pinia'

const gstStore = useGSTsStore()
const cardsStore = useCardsStore()
const { gsts, availableGSTs, gstsReturns } = storeToRefs(gstStore)
const { cards, totalDCards } = storeToRefs(cardsStore)
const allReturns = ref<GSTReturn[]>([])
const cardForm = reactive<{ gstin: string | null }>({
  gstin: null
})
const progress = ref(true)
const dialogVisible = ref(false)

let options: OptionType[]

const getReturns = async () => {
  progress.value = true

  await gstStore.getGSTReturns(cardForm.gstin as string)

  dialogVisible.value = false

  await cardsStore.addDCard(
    {
      gstin: cardForm.gstin as string,
      tradename: options.find((o) => o.value === cardForm.gstin)?.label,
      order: totalDCards.value + 1
    } as DCard,
    { limit: PAGE_LIMIT, order: 'asc', page: 1, sort: 'order' }
  )

  progress.value = false
}

watch(availableGSTs, (agsts) => {
  if (agsts != null) {
    options = agsts.map((gst) => ({
      value: gst.gstin,
      label: gst.tradename
    }))
  }
})

onMounted(async () => {
  await gstStore.getAllGSTs()

  progress.value = false
})
</script>

<template>
  <el-dialog v-model="dialogVisible" title="Add card">
    <el-form :model="cardForm">
      <el-form-item label="Select GSTIN" prop="gst">
        <el-select-v2
          v-model="cardForm.gstin"
          :options="options"
          placeholder="Please select a GSTIN"
        >
        </el-select-v2>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="getReturns"> Add </el-button>
      </span>
    </template>
  </el-dialog>

  <el-row
    v-if="cards && cards?.length > 0"
    class="m-b"
    style="justify-content: space-between"
    ><el-col class="flex-grow" :span="4">
      <el-button :icon="Plus" @click="dialogVisible = true">Add card</el-button>
    </el-col>
    <el-col :span="8" class="justify-end">
      <el-input
        :suffix-icon="Search"
        :autosize="false"
        placeholder="Search card here"
      ></el-input>
    </el-col>
  </el-row>
  <el-row
    v-if="cards && cards?.length > 0"
    :align="'top'"
    :justify="'start'"
    :gutter="10"
  >
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="card of cards">
      <return-status-card :card="card"></return-status-card>
    </el-col>
  </el-row>
  <el-row
    v-else
    v-loading="cards == null || progress"
    class="h-full w-full justify-center"
  >
    <el-empty
      :image-size="300"
      description="Add application cards to your dashboard"
    >
      <el-button type="primary" @click="dialogVisible = true"
        >Add card</el-button
      >
    </el-empty>
  </el-row>
</template>

<style scoped>
.el-col {
  margin-bottom: 8px;
}
</style>

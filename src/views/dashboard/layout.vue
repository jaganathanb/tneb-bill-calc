<script lang="ts" setup>
import { PAGE_LIMIT } from '@/constants'
import { useGstsStore } from '@/stores'
import { Plus, Search } from '@element-plus/icons-vue'
import type { OptionType } from 'element-plus/es/components/select-v2/src/select.types'
import { storeToRefs } from 'pinia'

const gstStore = useGstsStore()
const { gsts } = storeToRefs(gstStore)
const allReturns = ref<GSTReturn[]>([])
const cardForm = reactive<{ gstin: string | null }>({
  gstin: null
})
const progress = ref(true)
const dialogVisible = ref(false)

let options: OptionType[]

const getReturns = async () => {
  progress.value = true

  // await gstStore.getGSTReturns(cardForm.gstin as string)

  dialogVisible.value = false

  progress.value = false
}

onMounted(async () => {
  // await gstStore.getAllGSTs()

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
          <template #empty>
            <p>
              <el-text style="margin: 0 8px" :type="'info'"
                >No GST added into system.</el-text
              >
            </p>
          </template>
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
    class="m-b"
    style="justify-content: space-between"
    ><el-col class="flex-grow" :span="4">
      <el-button :icon="Plus" type="primary" @click="dialogVisible = true"
        >Add card</el-button
      >
    </el-col>
    <el-col :span="8" class="justify-end">
      <el-input
        :suffix-icon="Search"
        :autosize="false"
        placeholder="Search card here"
      ></el-input>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-col {
  margin-bottom: 8px;
}
</style>

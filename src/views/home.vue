<script lang="ts" setup>
import { useAppStore } from '@/stores/app.store'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { isCollapse } = storeToRefs(appStore)

const showAlert = () => {
  appStore.setIsCollapse(!isCollapse.value)
}
</script>

<template>
  <el-row :align="'top'" :justify="'start'" :gutter="10">
    <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"
      ><return-status></return-status>
    </el-col>
  </el-row>
  <div>
    <p><router-link to="bills">Manage bills</router-link></p>
    <el-button @click="showAlert()">Show notification</el-button>
  </div>
</template>

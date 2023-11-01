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
  <div>
    <h1>Hi!</h1>
    <p>You're logged in with Vue 3 + Pinia & JWT!!</p>
    <p><router-link to="/users">Manage Users</router-link></p>
    <el-button @click="showAlert()">Show notification</el-button>
  </div>
</template>

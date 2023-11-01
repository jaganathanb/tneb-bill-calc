<script setup>
import { storeToRefs } from 'pinia'

import { useAuthStore, useFeedbackStore } from '@/stores'

const authStore = useAuthStore()
const alertStore = useFeedbackStore()
const { user } = storeToRefs(authStore)

const showAlert = () => {
  alertStore.success('Testing alert', 'notification')
}
</script>

<template>
  <div>
    <h1>Hi {{ user?.firstName }}!</h1>
    <p>You're logged in with Vue 3 + Pinia & JWT!!</p>
    <p><router-link to="/users">Manage Users</router-link></p>
    <el-button @click="showAlert()">Show notification</el-button>
  </div>
</template>

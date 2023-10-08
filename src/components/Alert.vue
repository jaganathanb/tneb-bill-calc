<script setup>
import { storeToRefs } from 'pinia'

import { useAlertStore } from '@/stores'
import { ElAlert } from 'element-plus'

const alertStore = useAlertStore()
const { alert } = storeToRefs(alertStore)
</script>

<template>
  <ElAlert
    v-if="alert"
    :title="alert.title"
    :type="alert.type"
    :description="alert.description"
    show-icon
  />
</template>

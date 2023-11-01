<script setup>
import { storeToRefs } from 'pinia'

import { useFeedbackStore } from '@/stores'
import { ElAlert } from 'element-plus'

const alertStore = useFeedbackStore()
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

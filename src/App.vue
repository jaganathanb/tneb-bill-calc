<script setup>
import { RouterView } from 'vue-router'

import { Alert } from '@/components'
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()
</script>

<template>
  <RouterView />
</template>

<style>
@import '@/assets/base.css';
</style>

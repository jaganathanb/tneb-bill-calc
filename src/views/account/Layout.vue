<script lang="ts" setup>
import { Alert } from '@/components'
</script>
<template>
  <ElSpace direction="vertical">
    <Alert style="align-self: flex-start" />
    <router-view />
  </ElSpace>
</template>

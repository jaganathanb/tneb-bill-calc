<script lang="ts" setup>
import { Alert } from '@/components'
</script>
<template>
  <ElRow align="top" justify="center" style="height: 100%">
    <ElCol>
      <Alert />
    </ElCol>
    <ElRow align="middle">
      <ElCol>
        <router-view />
      </ElCol>
    </ElRow>
  </ElRow>
</template>

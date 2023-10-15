<script lang="ts" setup>
import { useAuthStore } from '@/stores'
import { router } from '@/router'
import { ElButton } from 'element-plus'

const usersStore = useAuthStore()

async function signOut() {
  await usersStore.signOut()

  await router.push('/auth')
}
</script>

<template>
  <h1>Want to log out?</h1>

  <ElButton @click="signOut">Sign out</ElButton>
</template>

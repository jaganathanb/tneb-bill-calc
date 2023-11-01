<script lang="ts" setup>
import { router } from '@/router'
import { useAuthStore } from '@/stores'
import { getCurrentUser } from 'vuefire'

const authStore = useAuthStore()

const currentUser = await getCurrentUser()

const signOut = async () => {
  await authStore.signOut()
  await router.push('/account/login')
}
</script>

<template>
  <nav v-show="currentUser" class="navbar navbar-expand navbar-dark bg-dark">
    <div class="navbar-nav">
      <RouterLink to="/" class="nav-item nav-link">Home</RouterLink>
      <RouterLink to="/users" class="nav-item nav-link">Users</RouterLink>
      <button @click="signOut()" class="btn btn-link nav-item nav-link">
        Logout
      </button>
    </div>
  </nav>
</template>

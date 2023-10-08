<script setup>
import { router } from '@/router'
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()

const signOut = async () => {
  await authStore.signOut()
  await router.push('/account/login')
}
</script>

<template>
  <nav v-show="authStore.user" class="navbar navbar-expand navbar-dark bg-dark">
    <div class="navbar-nav">
      <RouterLink to="/" class="nav-item nav-link">Home</RouterLink>
      <RouterLink to="/users" class="nav-item nav-link">Users</RouterLink>
      <button @click="signOut()" class="btn btn-link nav-item nav-link">
        Logout
      </button>
    </div>
  </nav>
</template>

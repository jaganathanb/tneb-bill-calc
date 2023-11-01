<script lang="ts" setup>
import SideBar from '@/components/SideBar.vue'
import TopBar from '@/components/TopBar.vue'
</script>

<template>
  <el-container class="w-full h-full">
    <el-header style="padding: 0">
      <TopBar />
    </el-header>
    <el-container>
      <el-aside class="side-bar">
        <SideBar class="w-full h-full" />
      </el-aside>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<style lang="css">
.side-bar {
  width: auto;
}

.side-bar:not(> ul.el-menu--collapse) {
  width: 300px;
}
</style>

<script lang="ts" setup>
import SideBar from '@/components/side-bar/side-bar.vue'
import TopBar from '@/components/top-bar.vue'
</script>

<template>
  <el-container class="w-full h-full">
    <el-header style="padding: 0">
      <TopBar />
    </el-header>
    <el-container class="h-full" style="max-height: calc(100% - 60px)">
      <el-aside class="side-bar">
        <el-container class="h-full">
          <SideBar class="h-full" />
        </el-container>
      </el-aside>
      <el-main><router-view /> </el-main>
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

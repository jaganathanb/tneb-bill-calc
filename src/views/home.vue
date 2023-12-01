<script lang="ts" setup></script>

<template>
  <el-row :align="'top'" :justify="'start'" :gutter="10">
    <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4"
      ><return-status-card :count="32"></return-status-card>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-col {
  margin-bottom: 8px;
}
</style>

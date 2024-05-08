<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue'

defineProps({
  count: {
    type: Number
  }
})
</script>

<template>
  <el-badge class="item" :hidden="count === 0" :value="count">
    <el-button circle>
      <template #icon>
        <Bell />
      </template>
    </el-button>
  </el-badge>
</template>

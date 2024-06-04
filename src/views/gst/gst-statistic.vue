<script setup lang="ts">
defineProps({
  statistic: {
    type: Number,
    default: 0
  },
  title: String,
  highlight: Boolean
})
</script>

<template>
  <el-statistic
    class="mb-4 mr-4 ml-4"
    :value="statistic"
    :value-style="{
      display: 'flex',
      justifyContent: 'center',
      color: highlight ? (statistic > 0 ? 'red' : 'green') : 'inherit'
    }"
  >
    <template #title>
      <div>{{ title }}</div>
    </template>
  </el-statistic>
</template>

<style lang="scss">
.el-statistic__content {
  display: flex;
}
</style>

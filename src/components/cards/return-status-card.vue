<script lang="ts" setup>
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  count: {
    type: Number,
    required: true
  }
})

const navigateTo = async () => {
  await router.push('bills')
}

const monthYear = dayjs().format('MMM YYYY')
</script>

<template>
  <el-card :shadow="'hover'">
    <el-container>
      <el-row align="middle" class="w-full" :justify="'center'">
        <el-col class="flex w-full justify-center">
          <el-link
            @click="navigateTo"
            :type="'success'"
            :underline="false"
            class="count"
            >{{ count }}</el-link
          >
        </el-col>
        <el-col class="flex datetime w-full justify-center"
          ><el-text>filed on {{ monthYear }}</el-text></el-col
        >
      </el-row>
    </el-container>
  </el-card>
</template>

<style scoped>
.count {
  font-size: 6rem;
}
</style>

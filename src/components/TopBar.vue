<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <el-menu mode="horizontal" :ellipsis="false">
    <el-menu-item>
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        TNEB
      </button>
    </el-menu-item>
    <div class="flex-grow-1"></div>
    <el-menu-item @click="toggleDark()">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        test
      </button>
    </el-menu-item>
    <el-menu-item>
      <el-popover placement="bottom" :width="300" trigger="click">
        <template #reference>
          <el-avatar size="default" alt="JaganB" />
        </template>
        <el-table>
          <el-table-column width="150" property="date" label="date" />
          <el-table-column width="100" property="name" label="name" />
          <el-table-column width="300" property="address" label="address" />
        </el-table>
      </el-popover>
    </el-menu-item>
  </el-menu>
</template>

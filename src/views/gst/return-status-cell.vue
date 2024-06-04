<script setup lang="ts">
import type { Component, PropType, VNode } from 'vue'

type StatusDropdownItem = {
  icon: VNode | Component
  color: string
  label: string
}

defineProps({
  returnStatus: {
    type: Object as PropType<StatusDropdownItem>,
    required: true
  }
})
</script>

<template>
  <div class="return-status flex flex-items-center">
    <el-icon size="18" :class="returnStatus.color">
      <component :is="returnStatus.icon" /> </el-icon
    ><span>{{ returnStatus.label }}</span>
  </div>
</template>

<style lang="scss">
.return-status {
  .el-icon {
    margin-right: 8px;

    &.blue {
      --color: rgb(71, 71, 247);
    }

    &.green {
      --color: rgb(4, 128, 14);
    }

    &.orange {
      --color: rgb(212, 119, 42);
    }

    &.lightBlue {
      --color: rgb(65, 201, 255);
    }
  }
}

html.dark {
  .return-status {
    .el-icon {
      margin-right: 8px;

      &.blue {
        --color: #a4a4f5;
      }
    }
  }
}
</style>

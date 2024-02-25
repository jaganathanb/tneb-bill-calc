<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useDialog } from '@/stores/dialog.store'
const dialog = useDialog()
const { isOpen, props } = storeToRefs(dialog)
</script>

<template>
  <el-dialog v-model="isOpen">
    <component :is="props.comp" />
    <template #footer>
      <span class="dialog-footer">
        <button
          v-for="(action, i) in props.actions"
          :key="i"
          class="btn"
          @click="action.callback(props.props)"
        >
          {{ action.label }}
        </button>
      </span>
    </template>
  </el-dialog>
</template>

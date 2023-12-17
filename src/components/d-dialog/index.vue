<script lang="ts" setup>
import { useDialog } from '@/stores/dialog.store'
import { storeToRefs } from 'pinia'
const dialog = useDialog()
const { isOpen, props } = storeToRefs(dialog)
</script>

<template>
  <el-dialog v-model="isOpen">
    <component :is="props.comp"></component>
    <template #footer>
      <span class="dialog-footer">
        <button
          v-for="action in props.actions"
          class="btn"
          @click="action.callback(props.props)"
        >
          {{ action.label }}
        </button>
      </span>
    </template>
  </el-dialog>
</template>

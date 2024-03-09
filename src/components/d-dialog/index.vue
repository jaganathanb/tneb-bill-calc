<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useDDialog } from '@/stores/dialog.store'

import type { Component } from 'vue'

const dialog = useDDialog()
const { isOpen, actions, model } = storeToRefs(dialog)

defineProps<{
  view: Component
}>()
</script>

<template>
  <el-dialog
    v-model="isOpen"
    :close-on-click-modal="false"
    :title="model.title"
  >
    <component :is="view" />
    <template #footer>
      <span class="dialog-footer">
        <el-button
          v-for="(action, i) in actions"
          :key="i"
          :type="action.type ?? 'primary'"
          @click="action.callback(model.data)"
        >
          {{ action.label }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

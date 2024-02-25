<script setup lang="ts">
import { computed } from 'vue'

import { ElDatePicker } from 'element-plus'

type ValueType = Date | string | number | undefined

const properties = withDefaults(
  defineProps<{
    modelValue?: ValueType
    placeholder?: string
  }>(),
  {
    modelValue: undefined,
    placeholder: 'Pick a date'
  }
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: ValueType): void
}>()

const current = computed({
  get: () => {
    return properties.modelValue
  },
  set: (value) => {
    emit('update:modelValue', value as ValueType)
  }
})
</script>
<template>
  <el-date-picker
    v-model="current"
    value-format="YYYY-MM-DD HH:mm:ss"
    :placeholder="placeholder"
    clearable
    class="base-date-picker"
  />
</template>
<style lang="scss">
.base-date-picker {
  &.el-date-editor {
    &.el-input,
    .el-input__wrapper {
      width: 100%;
    }
  }
}
</style>

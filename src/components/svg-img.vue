<script lang="ts" setup>
import { ref } from 'vue'

const url: Ref<string> = ref('')
const properties = defineProps({
  name: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    default: 24
  },
  width: {
    type: Number,
    default: 24
  }
})

const modules = import.meta.glob('../assets/img/**/*.svg', { as: 'url' })

watch(
  () => properties.name,
  async () => {
    url.value = await modules[`../assets/img/${properties.name}.svg`]()
  },
  { immediate: true }
)
</script>

<template>
  <img
    :src="url"
    :width="properties.width"
    :height="properties.height"
    alt="logo"
  />
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
let url: Ref<string> = ref('')
const props = defineProps({
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
  () => props.name,
  async () => {
    url.value = await modules[`../assets/img/${props.name}.svg`]()
  },
  { immediate: true }
)
</script>

<template>
  <img :src="url" :width="props.width" :height="props.height" alt="logo" />
</template>

<style lang="scss" scoped></style>

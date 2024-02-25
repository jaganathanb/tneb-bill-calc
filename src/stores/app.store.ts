import { type Ref, ref } from 'vue'

import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', () => {
  const isCollapse: Ref<boolean> = ref(false)

  const setIsCollapse = (collapse: boolean) => {
    isCollapse.value = collapse
  }

  return { isCollapse, setIsCollapse }
})

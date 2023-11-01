import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useAppStore = defineStore('appStore', () => {
  const isCollapse: Ref<boolean> = ref(false)

  const setIsCollapse = (collapse: boolean) => {
    isCollapse.value = collapse
  }

  return { isCollapse, setIsCollapse }
})

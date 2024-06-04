import { type Ref, ref } from 'vue'

import { acceptHMRUpdate, defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', () => {
  const isCollapse: Ref<boolean> = ref(
    Boolean(localStorage.getItem('sidebar_collapsed'))
  )

  const setIsCollapse = (collapse: boolean) => {
    isCollapse.value = collapse

    localStorage.setItem('sidebar_collapsed', String(collapse))
  }

  return { isCollapse, setIsCollapse }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}

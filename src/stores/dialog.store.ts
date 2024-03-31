import { acceptHMRUpdate, defineStore } from 'pinia'

let callback: (data: any) => void

const setData = (data: any) => {
  callback(data)
}

export const useDDialog = defineStore('dDialog', () => {
  const isOpen = ref(false)
  const inProgress = ref(false)
  const error = ref('')

  const open = (callback_: (data: any) => Promise<undefined> | undefined) => {
    isOpen.value = true

    callback = callback_
  }

  const close = () => {
    isOpen.value = false
    inProgress.value = false
    error.value = ''
  }

  return {
    isOpen,
    inProgress,
    error,
    setData,
    open,
    close
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDDialog, import.meta.hot))
}

import { defineStore } from 'pinia'

let callback: (data: any) => void

const setData = (data: any) => {
  callback(data)
}

export const useDDialog = defineStore('dDialog', () => {
  const isOpen = ref(false)
  const inProgress = ref(false)

  const open = (callback_: (data: any) => Promise<undefined> | undefined) => {
    isOpen.value = true

    callback = callback_
  }

  const close = () => {
    isOpen.value = false
    inProgress.value = false
  }

  return {
    isOpen,
    inProgress,
    setData,
    open,
    close
  }
})

import { defineStore } from 'pinia'

import type { ButtonType } from 'element-plus'
import type { Component } from 'vue'

export type DModal = {
  isOpen: boolean
  view: Component
  actions?: DModalAction[]
}

export type DDialogData<T> = {
  title: string
  width?: number
  data?: T
}

export type DModalAction = {
  label: string
  type?: ButtonType
  callback: (properties?: any) => void
}

export const useDDialog = defineStore('dDialog', () => {
  const isOpen = ref(false)
  const model = ref<DDialogData<any>>({} as DDialogData<any>)
  const actions = ref<DModalAction[]>([])

  const open = <T>(viewModel: DDialogData<T>, viewActions: DModalAction[]) => {
    actions.value = viewActions
    model.value = viewModel

    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    actions.value = []
  }

  return {
    isOpen,
    actions,
    model,
    open,
    close
  }
})

import { defineStore } from 'pinia'

import type { Component } from 'vue'

export type ModalAction = {
  label: string
  callback: (properties?: any) => void
}

export interface ModalProperties {
  comp: undefined | Component
  props?: any
  actions: ModalAction[] | undefined | undefined
}

export const useDialog = defineStore('dDialog', () => {
  const isOpen = ref(false)
  let properties: ModalProperties | undefined = {} as ModalProperties

  const open = (dialogProperties: ModalProperties) => {
    isOpen.value = true
    properties = dialogProperties
  }

  const close = () => {
    isOpen.value = false
    properties = undefined
  }

  return {
    isOpen,
    props: properties,
    open,
    close
  }
})

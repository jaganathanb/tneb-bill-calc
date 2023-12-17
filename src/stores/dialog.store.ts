import { markRaw } from 'vue'
import { defineStore } from 'pinia'
import type { Component } from 'vue'
import type { PropType } from 'vue'

export type ModalAction = {
  label: string
  callback: (props?: any) => void
}

export interface ModalProps {
  comp: null | Component
  props?: any
  actions: ModalAction[] | null | undefined
}

export const useDialog = defineStore('dDialog', () => {
  const isOpen = ref(false)
  let props: ModalProps | null = {} as ModalProps

  const open = (dialogProps: ModalProps) => {
    isOpen.value = true
    props = dialogProps
  }

  const close = () => {
    isOpen.value = false
    props = null
  }

  return {
    isOpen,
    props,
    open,
    close
  }
})

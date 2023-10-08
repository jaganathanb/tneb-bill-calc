import type { AlertProps } from 'element-plus'
import { defineStore } from 'pinia'

export const useAlertStore = defineStore({
  id: 'alert',
  state: () =>
    ({
      alert: null
    }) as { alert: AlertProps | null },
  actions: {
    success(description: string) {
      this.alert = {
        description,
        type: 'success',
        title: 'Success'
      } as AlertProps
    },
    error(description: string) {
      this.alert = { description, type: 'error', title: 'Error' } as AlertProps
    },
    clear() {
      this.alert = null
    }
  }
})

import { acceptHMRUpdate, defineStore } from 'pinia'

import settingsService from '@/services/settings.service'

export const useSettingsStore = defineStore('settings', () => {
  const settingService = settingsService()
  const settings = ref<DAppsSettings>({} as DAppsSettings)
  const progress = ref(false)

  const getAll = async () => {
    const u = await settingService.getAll()
    settings.value = u.data.result
  }

  const update = async (data: DAppsSettings) => {
    const payload = {
      crontab: data.crontab,
      gstBaseUrl: data.gstBaseUrl,
      gstPassword: data.gstPassword,
      gstUsername: data.gstUsername,
      id: data.id,
      modifiedBy: data.modifiedBy
    } as DAppsSettings

    const u = await settingService.update(payload)
    progress.value = false

    settings.value = u.data.result

    return u.data.result
  }

  return {
    getAll,
    update,
    settings,
    progress
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}

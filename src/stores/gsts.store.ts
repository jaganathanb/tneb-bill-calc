import { type Ref, ref } from 'vue'

import { defineStore } from 'pinia'

import { gstService } from '@/services'

export const useGstsStore = defineStore('gstsStore', () => {
  const service = gstService()
  const gsts: Ref<PagingResult | undefined> = ref(undefined)

  const getAll = async (pageFilter: PagingRequest) => {
    const d = await service.getAll(pageFilter)
    gsts.value = d.data.result
  }

  const getById = async (gstin: string) => {
    return service.getById(gstin)
  }

  const deleteById = async (gstin: string) => {
    return service.deleteById(gstin)
  }

  const updateById = async (gst: Gst) => {
    return service.updateById(gst)
  }

  const createByIds = async (gstins: string[]) => {
    return service.createByIds(gstins)
  }

  return {
    gsts,
    getAll,
    getById,
    deleteById,
    updateById,
    createByIds
  }
})

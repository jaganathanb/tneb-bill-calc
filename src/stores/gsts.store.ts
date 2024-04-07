import { ref } from 'vue'

import { acceptHMRUpdate, defineStore } from 'pinia'

import { gstService } from '@/services'

export const useGstsStore = defineStore('gstsStore', () => {
  const service = gstService()
  const gsts = ref<PagedGsts>()
  const statistics = ref<GstStatistics>({} as GstStatistics)
  const loading = ref(true)
  const error = ref<string>()

  const getAll = async (pageFilter: PagingRequest) => {
    try {
      const d = await service.getAll(pageFilter)

      const rawGsts = d.data.result

      gsts.value = {
        ...rawGsts,
        items: getMappedGst(rawGsts.items) ?? []
      }
    } catch (dataError: unknown) {
      error.value = (dataError as Error).toString()
    } finally {
      loading.value = false
    }
  }

  const getById = async (gstin: string) => {
    try {
      return await service.getById(gstin)
    } catch (dataError: unknown) {
      error.value = (dataError as Error).toString()
    } finally {
      loading.value = false
    }
  }

  const deleteById = async (gstin: string) => {
    try {
      return await service.deleteById(gstin)
    } catch (dataError: unknown) {
      error.value = (dataError as Error).toString()
    } finally {
      loading.value = false
    }
  }

  const updateById = async (gst: Gst) => {
    try {
      return await service.updateById(gst)
    } catch (dataError: unknown) {
      error.value = (dataError as Error).toString()
    } finally {
      loading.value = false
    }
  }

  const updateReturnStatusById = async (
    gstin: string,
    type: GSTReturnType,
    status: GstReturnStatus
  ) => {
    try {
      const response = await service.updateReturnStatusById(gstin, type, status)
      if (response.data.result) {
        const gstIndex = gsts.value?.items.findIndex(
          (g) => g.gstin === gstin
        ) as number
        const gst = gsts.value?.items[gstIndex] as GstMap
        switch (type) {
          case 'GSTR1': {
            gst.gstr1 = {
              ...gst.gstr1,
              status
            }
            break
          }
          case 'GSTR3B': {
            gst.gstr3b = {
              ...gst.gstr3b,
              status
            }
            break
          }
          case 'GSTR2': {
            gst.gstr2 = {
              ...gst.gstr2,
              status
            }
            break
          }
          case 'GSTR9': {
            gst.gstr9 = {
              ...gst.gstr9,
              status
            }
            break
          }
          default: {
            break
          }
        }
      }

      return response.data.result
    } catch (dataError: unknown) {
      error.value = (dataError as Error).toString()
    } finally {
      loading.value = false
    }
  }

  const updateLockById = async (gstin: string, locked: boolean) => {
    try {
      const response = await service.updateLockById(gstin, locked)

      const gst = gsts.value?.items.find((g) => g.gstin === gstin) as GstMap
      gst.locked = response.data.result ? locked : !locked

      return response.data.result
    } catch (dataError: unknown) {
      error.value = (dataError as Error).toString()
    } finally {
      loading.value = false
    }
  }

  const createByIds = async (gsts: Gst[]) => {
    try {
      return await service.createByIds(gsts)
    } catch (dataError: unknown) {
      error.value = (dataError as Error).toString()
    } finally {
      loading.value = false
    }
  }

  const getGstStatistics = async () => {
    try {
      const response = await service.getGstStatistics()

      if (response.status == 200) {
        statistics.value = response.data.result
      }
    } catch (dataError: unknown) {
      error.value = (dataError as Error).toString()
    } finally {
      loading.value = false
    }
  }

  const refreshGstReturns = async () => {
    try {
      await service.refreshGstReturns()
    } catch (dataError: unknown) {
      error.value = (dataError as Error).toString()
    } finally {
      loading.value = false
    }
  }

  return {
    gsts,
    loading,
    error,
    statistics,
    getAll,
    getById,
    deleteById,
    updateById,
    updateReturnStatusById,
    updateLockById,
    createByIds,
    getGstStatistics,
    refreshGstReturns
  }
})

const getMappedGst = (gsts: Gst[]): GstMap[] | undefined => {
  return gsts.map(
    (g) =>
      ({
        ...g,
        gstr1: g.gstStatuses.find((s) => s.returnType === 'GSTR1'),
        gstr2: g.gstStatuses.find((s) => s.returnType === 'GSTR2'),
        gstr3b: g.gstStatuses.find((s) => s.returnType === 'GSTR3B'),
        gstr9: g.gstStatuses.find((s) => s.returnType === 'GSTR9')
      }) as GstMap
  )
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGstsStore, import.meta.hot))
}

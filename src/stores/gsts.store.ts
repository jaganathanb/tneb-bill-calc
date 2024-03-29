import { ref } from 'vue'

import { defineStore } from 'pinia'

import { gstService } from '@/services'

export const useGstsStore = defineStore('gstsStore', () => {
  const service = gstService()
  const gsts = ref<PagedGsts>()
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
        const gst = gsts.value?.items.find((g) => g.gstin === gstin) as GstMap
        switch (type) {
          case 'GSTR1': {
            gst.gstr1.status = status
            break
          }
          case 'GSTR3B': {
            gst.gstr3b.status = status
            break
          }
          case 'GSTR2': {
            gst.gstr2.status = status
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

  return {
    gsts,
    loading,
    error,
    getAll,
    getById,
    deleteById,
    updateById,
    updateReturnStatusById,
    updateLockById,
    createByIds
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

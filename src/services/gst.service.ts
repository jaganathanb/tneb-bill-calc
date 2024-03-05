import { useHttpClient } from '@/hooks'

import type { AxiosResponse } from 'axios'

export interface GstsService {
  createByIds: (gstins: string[]) => Promise<AxiosResponse<string, any>>
  getAll: (
    pageRequest: PagingRequest
  ) => Promise<AxiosResponse<HttpResponseData<PagingResult>, any>>
  getById: (id: string) => Promise<AxiosResponse<HttpResponseData<Gst>, any>>
  deleteById: (
    gstin: string
  ) => Promise<AxiosResponse<HttpResponseData<boolean>, any>>
  updateById: (gst: Gst) => Promise<AxiosResponse<HttpResponseData<Gst>, any>>
  updateReturnStatusById: (
    gstin: string,
    type: GSTReturnType,
    status: GstReturn1Status | GstReturn3bStatus
  ) => Promise<
    AxiosResponse<HttpResponseData<GstReturn1Status | GstReturn3bStatus>, any>
  >
  updateLockById: (
    gstin: string,
    locked: boolean
  ) => Promise<AxiosResponse<HttpResponseData<boolean>, any>>
}

export default (function () {
  const httpClient = useHttpClient()

  const getAll = (pageRequest: PagingRequest) => {
    return httpClient.post<HttpResponseData<PagingResult>>(
      '/gsts/page',
      pageRequest
    )
  }

  const getById = (gstin: string) => {
    return httpClient.get(`/gsts/${gstin}`)
  }

  const deleteById = (gstin: string) => {
    return httpClient.delete(`/gsts/${gstin}`)
  }

  const updateById = (gst: Gst) => {
    return httpClient.put(`/gsts`, gst)
  }

  const updateReturnStatusById = (
    gstin: string,
    returnType: GSTReturnType,
    status: GstReturn1Status | GstReturn3bStatus
  ) => {
    return httpClient.put(`/gsts/${gstin}/return-status`, {
      status,
      returnType
    })
  }

  const updateLockById = (gstin: string, locked: boolean) => {
    return httpClient.put(`/gsts/${gstin}/lock`, { locked })
  }

  const createByIds = (gstins: string[]) => {
    return httpClient.post<string>('/gsts', gstins)
  }

  const instance: GstsService = {
    getAll,
    getById,
    updateById,
    deleteById,
    createByIds,
    updateReturnStatusById,
    updateLockById
  }

  return () => {
    return instance
  }
})()

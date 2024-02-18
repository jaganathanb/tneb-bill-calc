import { useHttpClient } from "@/hooks"
import type { AxiosResponse } from "axios"

export interface GstsService {
    createByIds: (gstins: string[]) => Promise<AxiosResponse<string, any>>
    getAll: (pageReq: PagingRequest) => Promise<AxiosResponse<PagingResponse, any>>
    getById: (id: string) => Promise<AxiosResponse<Gst, any>>
    deleteById: (gstin: string) => Promise<AxiosResponse<boolean, any>>
    updateById: (gst: Gst) => Promise<AxiosResponse<Gst, any>>
}

export default (function () {
    const httpClient = useHttpClient()

    const getAll = (pageReq: PagingRequest) => {
        return httpClient.post<PagingResponse>('/gsts/page', pageReq)
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

      const createByIds = (gstins: string[]) => {
        return httpClient.post<string>('/gsts', gstins)
      }
  
    let instance: GstsService = { getAll, getById, updateById, deleteById, createByIds };
  
    return () => {
      return instance;
    };
  })()
  
import axios from 'axios'

import type { AxiosError, AxiosInstance } from 'axios'

export default (function () {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_APIURL
  })

  instance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${atob(
      localStorage.getItem(`${localStorage.getItem('userId')}_token`) ?? ''
    )}`

    return config
  })

  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error: AxiosError<HttpResponseData<string>>) => {
      if (error.response?.data?.error === 'token invalid') {
        localStorage.removeItem(`${localStorage.getItem('userId')}_token`)

        location.reload()
      }
      return Promise.reject(error)
    }
  )

  return (): AxiosInstance => {
    return instance
  }
})()

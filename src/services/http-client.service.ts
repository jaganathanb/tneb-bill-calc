import axios from 'axios'

import type { AxiosError, AxiosInstance } from 'axios'

export default (function () {
  const instance = axios.create()

  instance.interceptors.request.use((config) => {
    config.baseURL = window.__dapps.apiUrl
    config.headers.Authorization = `Bearer ${atob(
      localStorage.getItem(`${localStorage.getItem('userName')}_token`) ?? ''
    )}`

    const user = JSON.parse(localStorage.getItem('user') ?? '{}') as User

    config.headers.set('dapps-user-id', user.id)

    return config
  })

  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error: AxiosError<HttpResponseData<string>>) => {
      if (error.response?.data?.error === 'token invalid') {
        localStorage.removeItem(`${localStorage.getItem('userName')}_token`)

        location.reload()
      }
      return Promise.reject(error)
    }
  )

  return (): AxiosInstance => {
    return instance
  }
})()

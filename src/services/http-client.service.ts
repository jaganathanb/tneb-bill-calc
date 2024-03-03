import axios, { type AxiosInstance } from 'axios'

export default (function () {
  const instance = axios.create({
    baseURL: 'http://localhost:5005/api/v1/',
    headers: {
      Authorization: atob(
        localStorage.getItem(`${localStorage.getItem('userId')}_token`) ?? ''
      )
    }
  })

  return (): AxiosInstance => {
    return instance
  }
})()

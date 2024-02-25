import axios, { type AxiosInstance } from 'axios'

export default (function () {
  const instance = axios.create({
    baseURL: 'http://localhost:5005/api/v1/'
  })

  return (): AxiosInstance => {
    return instance
  }
})()

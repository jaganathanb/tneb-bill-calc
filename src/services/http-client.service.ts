import axios, { type AxiosAdapter, type AxiosInstance } from 'axios'

export default (function () {
  const instance = axios.create({
    baseURL: 'https://taxpayer.irisgst.com/api',
    headers: {
      apikey: '541c70c2-c0c8-47ec-b40e-68990f0fbd07',
      'Cache-Control': 'no-cache'
    }
  })

  return (): AxiosInstance => {
    return instance
  }
})()

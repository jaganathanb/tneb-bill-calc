interface PageTable<T> {
  list: Array<T>
  total: number
}

interface Params {
  _page: number
  _limit: number
  _sort: string
  _order: string
}

interface Bill {
  id: string
  billId: string
  amount: number
  units: number
  startDate: string
  endDate: string
  dateRange: string
}

interface ReceiptQuery {
  userName_like?: string
  mobile_like?: string
  date_gte?: string
  date_lte?: string
  areaName_like?: string
  area_like?: string
  area?: string
}

type SearchParams = Params & ReceiptQuery

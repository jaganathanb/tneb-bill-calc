interface PageTable<T> {
  list: Array<T>
  total: number
}

interface Params {
  page: number
  limit: number
  sort: string
  order: OrderByDirection
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

interface IRIS_GST {
  pradr: IRIS_PRADR
}

interface IRIS_PRADR {
  bno: string
  st: string
  loc: string
  stcd: string
  pncd: string
}

interface GST extends IRIS_GST {
  id: string
  gstin: string
  name: string
  tradename: string
  registrationDate: string
  address: string
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

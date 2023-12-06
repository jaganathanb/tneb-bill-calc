interface PageTable<T> {
  list: Array<T>
  total: number
}

interface Params {
  page: number
  limit: number
  sort: string
  order: 'desc' | 'asc'
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

interface DCard {
  id: string
  order: number
  gstin: string
  tradename: string
}

type ModeOfFiling = 'ONLINE' | 'OFFLINE'
type GSTReturnType = 'GSTR1' | 'GSTR3B' | 'GSTR9'
type GSTReturnStatus = 'Filed' | 'Pending'

interface GSTReturn {
  id?: string
  valid?: string
  mof: ModeOfFiling
  dof: string
  rtntype: GSTReturnType
  ret_prd: string
  arn: string
  status: GSTReturnStatus
}

interface GSTReturnGroupedByType {
  [key: GSTReturnType]: GSTReturn[]
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

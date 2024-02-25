interface PageTable<T> {
  list: Array<T>
  total: number
}

interface Parameters_ {
  move: 'prev' | 'next'
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
  locked: boolean
  sno: number
  id: string
  gstin: string
  name: string
  tradename: string
  registrationDate: string
  address: string
  gstr1LastFiledDate: string
  gstr1LastStatus: number
  gstr1LastFiledTaxPeriod: string
  gstr3bLastFiledDate: string
  gstr3bLastStatus: number
  gstr3bLastFiledTaxPeriod: string
  gstr9LastFiledDate: string
  gstr9LastStatus: number
  gstr9LastFiledTaxPeriod: string
  gstr1PendingReturns: string[]
  gstr3bPendingReturns: string[]
  gstr9PendingReturns: string[]
  [key: string]: string | string[] | number
}

interface DCard {
  id: string
  order: number
  gstin: string
  tradename: string
}

type ModeOfFiling = 'ONLINE' | 'OFFLINE'
type GSTReturnType = 'GSTR1' | 'GSTR3B' | 'GSTR9' | 'GSTR2'
type GSTReturnStatus = 'Filed' | 'Not Filed'

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

type SearchParameters = Parameters_ & ReceiptQuery

type User = {
  userId: string
  firstName: string
  lastName: string
  userName: string
  email: string
  mobileNumber: string
  expiresIn: number
}

type UserCredential = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

type UserDetail = {
  user: User
  userCredential: UserCredential
}

interface PagingRequest {
  filter: Filter
  pageNumber: number
  pageSize: number
  sort: Sort[]
}

interface Filter {
  [prop: string]: FilterProperty
}

interface FilterProperty {
  filterType: string
  from: string
  to: string
  type: string
}

interface Sort {
  colId: string
  sort: string
}

interface PagingResponse {
  error: string
  result: PagingResult
  resultCode: number
  success: boolean
  validationErrors: ValidationError[]
}

interface PagingResult {
  hasNextPage: boolean
  hasPreviousPage: boolean
  items: Gst[]
  pageNumber: number
  totalPages: number
  totalRows: number
}

interface Gst {
  gstStatuses: GstStatus[]
  gstin: string
  lastUpdateDate: string
  locked: boolean
  mobile: string
  name: string
  permenantAddress: PermenantAddress
  registrationDate: string
  tradeName: string
  type: string
}

interface GstStatus {
  arn: string
  lastFiledDate: string
  modeOfFiling: string
  notes: string
  pendingReturns: string[]
  returnPeriod: string
  returnType: string
  status: string
  valid: string
}

interface PermenantAddress {
  city: string
  district: string
  doorNo: string
  landMark: string
  locality: string
  pincode: string
  state: string
  street: string
}

interface ValidationError {
  message: string
  property: string
  tag: string
  value: string
}

interface HttpResponse<T> {
  data: HttpResponseData<T>
  status: number
  statusText: string
}

interface HttpResponseData<T> {
  result: T
  success: boolean
  resultCode: number
  validationErrors: ValidationError[]
  error: any
}

interface AuthResult {
  accessToken: string
  refreshToken: string
  accessTokenExpireTime: number
  refreshTokenExpireTime: number
}

interface ValidationError {
  property: string
  tag: string
  field: string
  message: string
}

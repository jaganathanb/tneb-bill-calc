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
type GSTReturnTypeLowered = 'gstr1' | 'gstr3b' | 'gstr9' | 'gstr2'

type GstReturn1Status =
  | 'CallForInvoice'
  | 'InvoiceReceived'
  | 'InvoiceEntry'
  | 'Filed'
type GstReturn3bStatus = 'TaxPayable' | 'Intimated' | 'TaxPaid' | 'Filed'

type GstReturnStatus = GstReturn1Status | GstReturn3bStatus

interface GSTReturn {
  id?: string
  valid?: string
  mof: ModeOfFiling
  dof: string
  rtntype: GSTReturnType
  ret_prd: string
  arn: string
  status: GstReturn1Status
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
  id: number
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

interface PageConfig {
  page: number
  size: number
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

interface PagedGsts extends PagingResult {
  items: GstMap[]
}

interface GstMap extends Omit<Gst, 'gstStatuses'> {
  gstr1: GstStatus
  gstr3b: GstStatus
  gstr2: GstStatus
  gstr9: GstStatus
  [key: GSTReturnTypeLowered]: GstStatus
}

interface Gst {
  gstStatuses: GstStatus[]
  sno: string
  fno: string
  gstin: string
  lastUpdateDate: string
  locked: boolean
  mobileNumber: string
  name: string
  permenantAddress: PermenantAddress
  registrationDate: string
  tradeName: string
  type: string
  email: string
  username: string
  password: string
}

interface GstStatus {
  arn: string
  lastFiledDate: string
  modeOfFiling: string
  notes: string
  pendingReturns: string[]
  returnPeriod: string
  returnType: string
  status: GstReturnStatus
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

interface GstStatistics {
  gstr1Count: number
  gstr2Count: number
  gstr9Count: number
  gstr3bCount: number
  totalGsts: number
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

interface DAppsConfig {
  apiUrl: string
}

interface Window {
  __dapps: DAppsConfig
}

interface DAppsSettings extends BasePayload {
  crontab: string
  gstUsername: string
  gstPassword: string
  gstBaseUrl: string
}

type DAppsNotificationType = 'success' | 'error' | 'warning' | 'info'

interface DAppsNotification extends BasePayload {
  message: string
  messageType: DAppsNotificationType
  code?: string
  title: string
  isRead: boolean
  createdAt: string
}

interface BasePayload {
  createdBy: number
  modifiedBy: number
  deletedBy: number
  id: number
}

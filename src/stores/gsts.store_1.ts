import { PAGE_LIMIT } from '@/constants'
import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  updateDoc,
  deleteDoc,
  type DocumentData
} from 'firebase/firestore'
import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useHttpClient } from '@/hooks'
import { useCurrentUser, useFirestore } from 'vuefire'
import { data } from './data'
import { groupBy } from 'lodash'
import dayjs from 'dayjs'
import { Phone, DocumentChecked, Memo, Select } from '@element-plus/icons-vue'
import type { OptionType } from 'element-plus/es/components/select-v2/src/select.types'

type StatusDropdownItem = OptionType & {
  icon: VNode | Component
  color: string
}

export const useGSTsStore = defineStore('gsts', () => {
  const httpClient = useHttpClient()
  const gsts: Ref<{ [key: number]: GST[] | undefined }> = ref({})
  const availableGSTs: Ref<GST[] | null> = ref(null)
  const gstsReturns: Ref<{ [key: string]: GSTReturn[] }> = ref({})
  const totalGSTs: Ref<number> = ref(0)
  const currPage = ref(1)
  const pageSize = ref(PAGE_LIMIT)
  const gstr1StatusOptions = [
    {
      label: 'Call for invoice',
      icon: Phone,
      color: '',
      value: 1
    },
    {
      label: 'Invoice received',
      icon: DocumentChecked,
      color: 'orange',
      value: 2
    },
    {
      label: 'Entry done',
      icon: Memo,
      color: 'lightBlue',
      value: 3
    },
    {
      label: 'Filed',
      icon: Select,
      color: 'green',
      value: 4
    }
  ] as StatusDropdownItem[]

  const db = useFirestore()
  const user = useCurrentUser()

  const gstsRef = collection(db, `gst/${user.value?.uid}/gsts`).withConverter<
    GST,
    DocumentData
  >({
    toFirestore(gst) {
      const add = gst.pradr as IRIS_PRADR
      return {
        owner: gst.name,
        tradename: gst.tradename,
        registrationDate: gst.registrationDate,
        gstin: gst.gstin,
        gstr1LastFiledDate: gst.gstr1LastFiledDate,
        gstr1LastFiledTaxPeriod: gst.gstr1LastFiledTaxPeriod,
        gstr1PendingReturns: gst.gstr1PendingReturns,
        gstr1LastStatus: gst.gstr1LastStatus,
        gstr3bLastFiledDate: gst.gstr3bLastFiledDate,
        gstr3bLastFiledTaxPeriod: gst.gstr3bLastFiledTaxPeriod,
        gstr3bPendingReturns: gst.gstr3bPendingReturns,
        gstr3bLastStatus: gst.gstr3bLastStatus,
        gstr9LastFiledDate: gst.gstr9LastFiledDate,
        gstr9LastFiledTaxPeriod: gst.gstr9LastFiledTaxPeriod,
        gstr9PendingReturns: gst.gstr9PendingReturns,
        gstr9LastStatus: gst.gstr9LastStatus,
        address: `${add.bno}, ${add.st}, ${add.loc}, ${add.stcd} - ${add.pncd}`
      }
    },
    fromFirestore(snapshot) {
      const gst = snapshot.data() as GST
      gst.id = snapshot.id

      return gst
    }
  })

  const getInitialPage = (params: Params) => {
    return query(
      gstsRef,
      orderBy(params.sort, params.order),
      limit(params.limit as number)
    )
  }

  let collRef = getInitialPage({
    move: 'next',
    page: 1,
    limit: PAGE_LIMIT,
    sort: 'registrationDate',
    order: 'desc'
  })

  const getTotalGSTCount = async () => {
    totalGSTs.value = (await getCountFromServer(gstsRef)).data().count
  }

  const getGSTDetail = async (gstin: string, params: Params) => {
    // const res = await httpClient.get(`/search?gstin=${gstin}`)
    // if (res.status === 200) {
    //   const returns = await getGSTReturns(gstin)
    //   const gst = { ...res.data } as GST

    //   getGSTUpdatedWithReturns(gst, returns)

    //   gst.sno = totalGSTs.value ? totalGSTs.value + 1 : 1

    //   addGST(gst, params)
    // }

    const d = {
      status_code: 1,
      gstin: '33AAJPE0640D1ZH',
      fetchTime: '2023-04-11T23:27:31.598',
      name: 'KUPPUSAMY  ESWARAN',
      tradename: 'ARASI ELECTRICALS',
      registrationDate: '2017-07-01',
      center: 'METTUR-I RANGE',
      state: 'METTUR',
      center_cd: 'XP0202',
      state_cd: 'TN390',
      constitution: 'Sole Proprietorship',
      type: 'Regular',
      status: 'Active',
      lastUpdateDate: '2019-09-04',
      cancellationDate: null,
      nature: ['Retail Business', 'Wholesale Business'],
      einvoiceStatus: 'No',
      pradr: {
        bnm: '',
        st: 'METTUR MAIN ROAD,KOLATHUR',
        loc: 'METTUR',
        bno: '4-3-7A',
        stcd: 'Tamil Nadu',
        flno: '',
        lt: '',
        lg: '',
        pncd: '636303',
        ntr: 'Retail Business, Wholesale Business',
        district: 'Salem',
        city: '',
        locality: '',
        geocodelvl: '',
        landMark: ''
      },
      adadr: []
    } as any

    const returns = await getGSTReturns(gstin)
    const gst = d as GST

    getGSTUpdatedWithReturns(gst, returns)

    gst.sno = totalGSTs.value ? totalGSTs.value + 1 : 1

    addGST(gst, params)
  }

  const getGSTUpdatedWithReturns = (data: GST, returns: GSTReturn[]) => {
    const returnsGroup = groupBy(returns, 'rtntype')

    for (const [key, val] of Object.entries(returnsGroup)) {
      switch (key as GSTReturnType) {
        case 'GSTR1':
          fillReturnDates('GSTR1', val, data)
          break
        case 'GSTR3B':
          fillReturnDates('GSTR3B', val, data)
          break
        default:
          fillReturnDates('GSTR9', val, data)
          break
      }
    }
  }

  const fillReturnDates = (
    type: GSTReturnType,
    val: GSTReturn[],
    data: GST
  ) => {
    const pendings: string[] = []

    const filed = val
      .filter((v) => v.status === 'Filed')
      .map((m) => ({ dof: m.dof, ret_prd: m.ret_prd }))
      .sort((a, b) =>
        dayjs(a.dof, 'DD-MM-YYYY').isAfter(dayjs(b.dof, 'DD-MM-YYYY')) ? -1 : 1
      ) // sort by desc

    const lastFiledDate = dayjs(filed[0].dof, 'DD-MM-YYYY')
    const lastTaxPeriod = dayjs(filed[0].ret_prd, 'MMYYYY')
    const pendingCount = dayjs().diff(lastTaxPeriod, 'M') - 1

    if (pendingCount > 0) {
      for (let i = 0; i < pendingCount; i++) {
        pendings.push(lastTaxPeriod.add(1, 'M').format('MMYYYY'))
      }

      data[`${type.toLowerCase()}LastFiledDate` as string] = ''
      data[`${type.toLowerCase()}LastFiledTaxPeriod` as string] = lastTaxPeriod
        .add(1, 'M')
        .format('MMYYYY')
      data[`${type.toLowerCase()}LastStatus` as string] = 1
    } else {
      if (lastFiledDate.isBefore(dayjs().startOf('month').add(12, 'day'))) {
        data[`${type.toLowerCase()}LastFiledDate` as string] = filed[0].dof
        data[`${type.toLowerCase()}LastFiledTaxPeriod` as string] =
          filed[0].ret_prd
        data[`${type.toLowerCase()}LastStatus` as string] = 4
      } else {
        data[`${type.toLowerCase()}LastFiledDate` as string] = ''
        data[`${type.toLowerCase()}LastFiledTaxPeriod` as string] =
          lastFiledDate.add(1, 'month').format('MMYYYY')
        data[`${type.toLowerCase()}LastStatus` as string] = 1
      }
    }

    data[`${type.toLowerCase()}PendingReturns` as string] = pendings
  }

  const getGSTReturns = async (gstin: string) => {
    // const result = await httpClient.get(`/returnstatus?gstin=${gstin}`)

    // if (result.status === 200) {
    //   const {
    //     data: {
    //       data: { EFiledlist }
    //     }
    //   } = result

    //   gstsReturns.value[gstin] = EFiledlist as GSTReturn[]
    // }

    //gstsReturns.value[gstin] = data[gstin]

    return data[gstin]
  }

  const refresh = async (page: number) => {
    const docs = (await getDocs(collRef)).docs

    gsts.value[page] = docs.map((d) => d.data())

    updateGSTReturnStatus(gsts.value[page])

    getTotalGSTCount()
  }

  const updateGSTReturnStatus = (gsts: GST[] | undefined) => {
    for (const gst of gsts ?? []) {
    }
  }

  watch(
    [currPage, pageSize],
    async ([p]) => {
      await refresh(p)
    },
    { immediate: true }
  )

  const addGST = async (data: GST, params: Params) => {
    await addDoc(gstsRef, data)

    collRef = getInitialPage(params)

    await refresh(params.page as number)
  }

  const setGST = async (data: GST, params: Params) => {
    await updateDoc(doc(gstsRef, data.id), { ...data })

    collRef = getInitialPage(params)

    await refresh(params.page)
  }

  const removeGST = async (id: string) => {
    await deleteDoc(doc(gstsRef, id))
  }

  const loadPage = (params: Params) => {
    // Get the last visible document
    const lastVisible =
      params.page > currPage.value
        ? gsts.value[currPage.value]?.[pageSize.value - 1]
        : gsts.value[params.page]?.[0]

    if (lastVisible) {
      collRef = query(
        gstsRef,
        orderBy(params.sort, params.order),
        params.page > currPage.value
          ? startAfter(lastVisible.registrationDate)
          : startAt(lastVisible.registrationDate),
        limit(params.limit)
      )
    }

    currPage.value = params.page
    pageSize.value = params.limit
  }

  const getAllGSTs = async () => {
    const docs = (await getDocs(gstsRef)).docs

    availableGSTs.value = docs.map((d) => d.data())
  }

  return {
    gsts,
    availableGSTs,
    gstsReturns,
    addGST,
    setGST,
    removeGST,
    refresh,
    loadPage,
    getGSTDetail,
    getGSTReturns,
    getAllGSTs,
    totalGSTs
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGSTsStore, import.meta.hot))
}

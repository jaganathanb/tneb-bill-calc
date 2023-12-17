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
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'
import { data, gstDetails } from './data'
import { delay, groupBy } from 'lodash'
import dayjs from 'dayjs'
import type { PaginationProps, SortBy } from 'element-plus'
import type { OptionType } from 'element-plus/es/components/select-v2/src/select.types'
import { Phone, DocumentChecked, Memo, Select } from '@element-plus/icons-vue'
import type { Component, VNode } from 'vue'

export const useGSTsStore = defineStore('gsts', () => {
  const httpClient = useHttpClient()

  let gsts: Ref<GST[] | undefined> = ref(undefined)
  let lastRecord: GST | null = null
  const totalGSTs: Ref<number> = ref(0)
  const lastUpdateDate = ref(dayjs().format())

  const db = useFirestore()
  const user = useCurrentUser()

  const paging = ref({
    page: 1,
    limit: 2,
    sort: 'registrationDate',
    order: 'desc'
  } as Params)

  const gstsRef = collection(db, `gst/${user.value?.uid}/gsts`).withConverter<
    GST,
    DocumentData
  >({
    toFirestore(gst) {
      const add = gst.pradr as IRIS_PRADR

      return {
        owner: gst.name || '',
        tradename: gst.tradename || '',
        registrationDate: gst.registrationDate || '',
        gstin: gst.gstin || '',
        sno: gst.sno || '',
        gstr1LastFiledDate: gst.gstr1LastFiledDate || '',
        gstr1LastFiledTaxPeriod: gst.gstr1LastFiledTaxPeriod || '',
        gstr1PendingReturns: gst.gstr1PendingReturns || '',
        gstr1LastStatus: gst.gstr1LastStatus || '',
        gstr3bLastFiledDate: gst.gstr3bLastFiledDate || '',
        gstr3bLastFiledTaxPeriod: gst.gstr3bLastFiledTaxPeriod || '',
        gstr3bPendingReturns: gst.gstr3bPendingReturns || '',
        gstr3bLastStatus: gst.gstr3bLastStatus || '',
        gstr9LastFiledDate: gst.gstr9LastFiledDate || '',
        gstr9LastFiledTaxPeriod: gst.gstr9LastFiledTaxPeriod || '',
        gstr9PendingReturns: gst.gstr9PendingReturns || '',
        gstr9LastStatus: gst.gstr9LastStatus || '',
        address: `${add.bno}, ${add.st}, ${add.loc}, ${add.stcd} - ${add.pncd}`
      }
    },
    fromFirestore(snapshot) {
      const gst = snapshot.data() as GST
      gst.id = snapshot.id

      lastRecord = gst

      return gst
    }
  })

  const gstsQuery = computed(() => {
    const pageSize = paging.value.limit || PAGE_LIMIT
    const currPage = paging.value.page || 1

    if (lastRecord) {
      return query(
        gstsRef,
        orderBy(paging.value.sort as string, paging.value.order),
        pageSize > currPage
          ? startAfter(lastRecord.registrationDate)
          : startAt(lastRecord.registrationDate),
        limit(pageSize)
      )
    }

    return query(
      gstsRef,
      orderBy(paging.value.sort as string, paging.value.order),
      limit(pageSize || PAGE_LIMIT)
    )
  })

  gsts = useCollection(gstsQuery, { ssrKey: 'gsts' })

  const getTotalGSTCount = async () => {
    totalGSTs.value = (await getCountFromServer(gstsRef)).data().count
  }

  const getGSTDetail = async (gstin: string) => {
    // const res = await httpClient.get(`/search?gstin=${gstin}`)
    // if (res.status === 200) {
    //   const returns = await getGSTReturns(gstin)
    //   const gst = { ...res.data } as GST

    //   getGSTUpdatedWithReturns(gst, returns)

    //   gst.sno = totalGSTs.value ? totalGSTs.value + 1 : 1

    //   addGST(gst)
    // }
    const data = gstDetails[`${gstin}_Details`]

    const returns = await getGSTReturns(gstin)
    const gst = { ...data } as GST

    getGSTUpdatedWithReturns(gst, returns)

    gst.sno = totalGSTs.value ? totalGSTs.value + 1 : 1

    addGST(gst)
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
    const typeLowered = type.toLowerCase()

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
        pendings.push(lastTaxPeriod.add(i + 1, 'M').format('MMYYYY'))
      }

      data[`${typeLowered}LastFiledDate` as string] = ''
      data[`${typeLowered}LastFiledTaxPeriod` as string] = lastTaxPeriod
        .add(1, 'M')
        .format('MMYYYY')
      data[`${typeLowered}LastStatus` as string] = 1
    } else {
      if (lastFiledDate.isBefore(dayjs().startOf('month').add(12, 'day'))) {
        data[`${typeLowered}LastFiledDate` as string] = filed[0].dof || ''
        data[`${typeLowered}LastFiledTaxPeriod` as string] = filed[0].ret_prd
        data[`${typeLowered}LastStatus` as string] = 4
      } else {
        data[`${typeLowered}LastFiledDate` as string] = ''
        data[`${typeLowered}LastFiledTaxPeriod` as string] = lastTaxPeriod
          .add(1, 'month')
          .format('MMYYYY')
        data[`${typeLowered}LastStatus` as string] = 1
      }
    }

    data[`${typeLowered}PendingReturns` as string] = pendings
  }

  const getGSTReturns = async (gstin: string) => {
    // const result = await httpClient.get(`/returnstatus?gstin=${gstin}`)

    // if (result.status === 200) {
    //   const {
    //     data: {
    //       data: { EFiledlist }
    //     }
    //   } = result

    //   return EFiledlist as GSTReturn[]
    // }

    return data[gstin]
  }

  const addGST = async (data: GST) => {
    await addDoc(gstsRef, data)
  }

  const setGST = async (data: GST) => {
    await updateDoc(doc(gstsRef, data.id), { ...data })
  }

  const removeGST = async (id: string) => {
    await deleteDoc(doc(gstsRef, id))
  }

  const refresh = async () => {
    const notFiled = gsts.value?.filter((g) => g.gstr1LastStatus === 3) || []
    for (const gst of notFiled) {
      delay(
        async (g: GST) => {
          const returns = await getGSTReturns(g.gstin)

          const filed = returns.find(
            (r) =>
              r.ret_prd === g.gstr1LastFiledTaxPeriod &&
              r.status === 'Filed' &&
              r.rtntype === 'GSTR1'
          )

          if (filed) {
            if (
              dayjs(filed?.dof, 'DD-MM-YYYY').isAfter(
                dayjs().startOf('month').add(11, 'day')
              )
            ) {
              g.gstr1LastStatus = 1
              g.gstr1LastFiledTaxPeriod = dayjs(filed?.ret_prd, 'MMYYYY')
                .add(1, 'month')
                .format('MMYYYY')
            } else {
              g.gstr1LastStatus = 4
            }
            g.gstr1PendingReturns = g.gstr1PendingReturns.filter(
              (p) => p !== filed.ret_prd
            )

            await setGST(g)
          }
        },
        200,
        gst
      )
    }
  }

  return {
    gsts,
    paging,
    totalGSTs,
    addGST,
    setGST,
    removeGST,
    getGSTDetail,
    getTotalGSTCount,
    refresh
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGSTsStore, import.meta.hot))
}

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
import { useCurrentUser, useFirestore } from 'vuefire'

export const useBillsStore = defineStore('bills', () => {
  const bills: Ref<{ [key: number]: Bill[] | undefined }> = ref({})
  const totalBills: Ref<number> = ref(0)
  const currPage = ref(1)
  const pageSize = ref(PAGE_LIMIT)

  const db = useFirestore()
  const user = useCurrentUser()

  const billsRef = collection(
    db,
    `tneb/${user.value?.uid}/bills`
  ).withConverter<Bill, DocumentData>({
    toFirestore(n) {
      return n
    },
    fromFirestore(snapshot) {
      const bill = snapshot.data() as Bill
      bill.id = snapshot.id

      return bill
    }
  })

  const getInitialPage = (params: Params) => {
    return query(
      billsRef,
      orderBy(params.sort, params.order),
      limit(params.limit)
    )
  }

  let collRef = getInitialPage({
    page: 1,
    limit: PAGE_LIMIT,
    sort: 'startDate',
    order: 'desc'
  })

  const getTotalBillCount = async () => {
    totalBills.value = (await getCountFromServer(billsRef)).data().count
  }

  const refresh = async (page: number) => {
    const docs = (await getDocs(collRef)).docs

    bills.value[page] = docs.map((d) => d.data())

    getTotalBillCount()
  }

  watch(
    [currPage, pageSize],
    async ([p]) => {
      await refresh(p)
    },
    { immediate: true }
  )

  const addBill = async (data: Bill, params: Params) => {
    await addDoc(billsRef, data)

    collRef = getInitialPage(params)

    await refresh(params.page)
  }

  const setBill = async (data: Bill) => {
    await updateDoc(doc(billsRef, data.id), { ...data })
  }

  const removeBill = async (id: string) => {
    await deleteDoc(doc(billsRef, id))
  }

  const loadPage = (params: Params) => {
    // Get the last visible document
    const lastVisible =
      params.page > currPage.value
        ? bills.value[currPage.value]?.[pageSize.value - 1]
        : bills.value[params.page]?.[0]

    if (lastVisible) {
      collRef = query(
        billsRef,
        orderBy(params.sort, params.order),
        params.page > currPage.value
          ? startAfter(lastVisible.startDate)
          : startAt(lastVisible.startDate),
        limit(params.limit)
      )
    }

    currPage.value = params.page
    pageSize.value = params.limit
  }

  return { bills, addBill, setBill, removeBill, loadPage, totalBills }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBillsStore, import.meta.hot))
}

import { PAGE_LIMIT } from '@/constants'
import { useOffsetPagination } from '@vueuse/core'
import dayjs from 'dayjs'
import { buildTimeList } from 'element-plus'
import {
  addDoc,
  collection,
  setDoc,
  type DocumentData,
  doc,
  updateDoc,
  limit,
  orderBy,
  query,
  getCountFromServer,
  startAfter,
  startAt,
  getDocs,
  getDoc,
  Query
} from 'firebase/firestore'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'

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
      return bill
    }
  })

  let collRef = query(
    billsRef,
    orderBy('startDate', 'desc'),
    limit(pageSize.value)
  )

  const getTotalBillCount = async () => {
    totalBills.value = (await getCountFromServer(billsRef)).data().count
  }

  const refresh = async (page: number) => {
    const docs = (await getDocs(collRef)).docs

    bills.value[page] = docs.map((d) => d.data())

    getTotalBillCount()
  }

  watch(
    currPage,
    async (p) => {
      await refresh(p)
    },
    { immediate: true }
  )

  const addBill = async (data: Bill) => {
    await addDoc(billsRef, data)

    await refresh(currPage.value)
  }

  const setBill = async (data: Bill) => {
    await updateDoc(doc(billsRef, data.id), { ...data })
  }

  const nextPage = (params: Params) => {
    // Get the last visible document
    const lastVisible =
      params._page > currPage.value
        ? bills.value[currPage.value]?.[pageSize.value - 1]
        : bills.value[params._page]?.[0]

    if (lastVisible) {
      collRef = query(
        billsRef,
        orderBy('startDate', 'desc'),
        params._page > currPage.value
          ? startAfter(lastVisible.startDate)
          : startAt(lastVisible.startDate),
        limit(pageSize.value)
      )
    }

    currPage.value = params._page
    pageSize.value = params._limit
  }

  return { bills, addBill, setBill, nextPage, totalBills }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBillsStore, import.meta.hot))
}

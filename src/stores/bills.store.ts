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
  getDoc
} from 'firebase/firestore'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'

export const useBillsStore = defineStore('bills', () => {
  const bills: Ref<{ [key: number]: Bill[] }> = ref({})
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

  let first = query(
    billsRef,
    orderBy('startDate', 'desc'),
    limit(pageSize.value)
  )

  watch(
    currPage,
    async (p) => {
      const docs = (await getDocs(first)).docs

      if (docs.length > 0) {
        bills.value[p] = docs.map((d) => d.data())

        // Get the last visible document
        const lastVisible = docs[docs.length - 1]

        // Construct a new query starting at this document,
        // get the next 25 cities.
        first = query(
          billsRef,
          orderBy('startDate', 'desc'),
          startAfter(lastVisible),
          limit(pageSize.value)
        )

        getTotalBillCount()
      }
    },
    { immediate: true }
  )

  const getTotalBillCount = async () => {
    totalBills.value = (await getCountFromServer(first)).data().count
  }

  getTotalBillCount()

  const addBill = async (data: Bill) => {
    await addDoc(billsRef, data)
  }

  const setBill = async (data: Bill) => {
    await updateDoc(doc(billsRef, data.id), { ...data })
  }

  const nextPage = (params: Params) => {
    currPage.value = params._page
    pageSize.value = params._limit
  }

  return { bills, addBill, setBill, nextPage, totalBills }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBillsStore, import.meta.hot))
}

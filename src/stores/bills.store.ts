import { addDoc, collection, type DocumentData } from 'firebase/firestore'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'

interface Bill {
  id: string
  amount: number
  units: number
  startDate: string
  endDate: string
  dateRange: string
}

export const useBillsStore = defineStore('bills', () => {
  const bills: Ref<Bill[]> = ref<Bill[]>([])

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
      return {
        ...bill,
        dateRange: `${bill.startDate}-${bill.endDate}`
      }
    }
  })

  useCollection(billsRef, {
    target: bills
  })

  const addBill = async () => {
    await addDoc(billsRef, {
      id: (Math.random() * 1000).toString(16),
      amount: 100,
      units: 10,
      endDate: '2023-11-15T10:10:00',
      startDate: '2023-09-15T10:10:00'
    } as Bill)
  }

  return { bills, addBill }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBillsStore, import.meta.hot))
}

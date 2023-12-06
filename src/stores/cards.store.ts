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

export const useCardsStore = defineStore('cards', () => {
  const httpClient = useHttpClient()
  const cards: Ref<DCard[] | null> = ref(null)
  const totalDCards: Ref<number> = ref(0)
  const currPage = ref(1)
  const pageSize = ref(PAGE_LIMIT)

  const db = useFirestore()
  const user = useCurrentUser()

  const cardsRef = collection(
    db,
    `dcard/${user.value?.uid}/cards`
  ).withConverter<DCard, DocumentData>({
    toFirestore(card) {
      return card
    },
    fromFirestore(snapshot) {
      const card = snapshot.data() as DCard
      card.id = snapshot.id

      return card
    }
  })

  const getInitialPage = (params: Params) => {
    return query(
      cardsRef,
      orderBy(params.sort, params.order),
      limit(params.limit as number)
    )
  }

  let collRef = getInitialPage({
    page: 1,
    limit: PAGE_LIMIT,
    sort: 'order',
    order: 'asc'
  })

  const getTotalDCardCount = async () => {
    totalDCards.value = (await getCountFromServer(cardsRef)).data().count
  }

  const refresh = async (page: number) => {
    const docs = (await getDocs(collRef)).docs

    cards.value = docs.map((d) => d.data())

    getTotalDCardCount()
  }

  watch(
    [currPage, pageSize],
    async ([p]) => {
      await refresh(p)
    },
    { immediate: true }
  )

  const addDCard = async (data: DCard, params: Params) => {
    await addDoc(cardsRef, data)

    collRef = getInitialPage(params)

    await refresh(params.page as number)
  }

  const setDCard = async (data: DCard) => {
    await updateDoc(doc(cardsRef, data.id), { ...data })
  }

  const removeDCard = async (id: string) => {
    await deleteDoc(doc(cardsRef, id))

    await refresh(currPage.value)
  }

  const loadPage = (params: Params) => {
    // Get the last visible document
    const lastVisible =
      params.page > currPage.value
        ? cards.value?.[pageSize.value - 1]
        : cards.value?.[0]

    if (lastVisible) {
      collRef = query(
        cardsRef,
        orderBy(params.sort, params.order),
        params.page > currPage.value
          ? startAfter(lastVisible.gstin)
          : startAt(lastVisible.gstin),
        limit(params.limit)
      )
    }

    currPage.value = params.page
    pageSize.value = params.limit
  }

  return {
    cards,
    addDCard,
    setDCard,
    removeDCard,
    loadPage,
    totalDCards
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCardsStore, import.meta.hot))
}

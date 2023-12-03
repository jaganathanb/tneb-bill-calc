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

export const useGSTsStore = defineStore('gsts', () => {
  const httpClient = useHttpClient()
  const gsts: Ref<{ [key: number]: GST[] | undefined }> = ref({})
  const gstsReturns: Ref<GSTReturn[]> = ref([])
  const totalGSTs: Ref<number> = ref(0)
  const currPage = ref(1)
  const pageSize = ref(PAGE_LIMIT)

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
        tradeName: gst.tradename,
        registrationDate: gst.registrationDate,
        gstin: gst.gstin,
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
    page: 1,
    limit: PAGE_LIMIT,
    sort: 'registrationDate',
    order: 'desc'
  })

  const getTotalGSTCount = async () => {
    totalGSTs.value = (await getCountFromServer(gstsRef)).data().count
  }

  const getGSTReturns = async (gstin: string) => {
    const result = await httpClient.get(`/returnstatus?gstin=${gstin}`)

    if (result.status === 200) {
      const {
        data: {
          data: { EFiledlist }
        }
      } = result

      gstsReturns.value = (EFiledlist as GSTReturn[]).filter(
        (r) => r.rtntype === 'GSTR1'
      )
    }
  }

  const refresh = async (page: number) => {
    const docs = (await getDocs(collRef)).docs

    gsts.value[page] = docs.map((d) => d.data())

    getTotalGSTCount()
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

  const setGST = async (data: GST) => {
    await updateDoc(doc(gstsRef, data.id), { ...data })
  }

  const removeGST = async (id: string) => {
    await deleteDoc(doc(gstsRef, id))
  }

  const loadPage = (params: Required<Params>) => {
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

  const updateGSTReturns = (returns: GSTReturn[]) => {
    gstsReturns.value = returns
  }

  return {
    gsts,
    gstsReturns,
    addGST,
    setGST,
    removeGST,
    loadPage,
    getGSTReturns,
    updateGSTReturns,
    totalGSTs
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGSTsStore, import.meta.hot))
}

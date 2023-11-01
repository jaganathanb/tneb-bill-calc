import { defineStore } from 'pinia'

import {} from 'firebase/auth'
import { computed, nextTick, ref } from 'vue'

export type Bill = {
  name: string
  calories: number
  fat: number
  carbs: number
  protein: number
}

export const useBillsStore = defineStore('bills', () => {
  const headers = [
    { text: 'Id', value: 'id' },
    { text: 'Name', value: 'Name' },
    { text: 'Details', value: 'details', sortable: false, width: '100' },
    { text: 'URL', value: 'url', name: 'url', width: '180' },
    { text: 'Action', value: 'actions', sortable: false }
  ]

  const editedItem = ref({
    name: '',
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0
  } as Bill)

  const defaultItem = ref({
    name: '',
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0
  } as Bill)

  const editedIndex = ref(-1)

  const dialog = ref(false)
  const dialogDelete = ref(false)
  const bills = ref([] as Bill[])

  const formTitle = computed(() =>
    editedIndex.value === -1 ? 'New Item' : 'Edit Item'
  )

  function editItem(item: Bill) {
    editedIndex.value = bills.value.indexOf(item)
    editedItem.value = { ...item }
    dialog.value = true
  }

  function deleteItem(item: Bill) {
    editedIndex.value = bills.value.indexOf(item)
    editedItem.value = { ...item }
    dialogDelete.value = true
  }

  function deleteItemConfirm() {
    bills.value.splice(editedIndex.value, 1)
    void closeDelete()
  }

  async function close() {
    dialog.value = false
    await nextTick()
    editedItem.value = { ...defaultItem.value }
    editedIndex.value = -1
  }

  async function closeDelete() {
    dialogDelete.value = false
    await nextTick()
    editedItem.value = { ...defaultItem.value }
    editedIndex.value = -1
  }

  function save() {
    if (editedIndex.value > -1) {
      Object.assign(bills.value[editedIndex.value], editedItem)
    } else {
      bills.value.push(editedItem.value)
    }
    void close()
  }

  return {
    headers,
    bills,
    close,
    closeDelete,
    defaultItem,
    deleteItem,
    deleteItemConfirm,
    dialog,
    dialogDelete,
    editItem,
    editedIndex,
    editedItem,
    formTitle,
    save
  }
})

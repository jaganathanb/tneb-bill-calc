import { defineStore } from 'pinia';

import usersService from '@/services/users.service';

export const useUsersStore = defineStore("users", () => {
  const userService = usersService()
  const users = ref([] as User[])


  const getAll = async () => {
    const u = await userService.getAll()
    users.value = u.data
  }

  const getById = async (id: string) => {
    const u = await userService.getById(id)
    
    return u.data
  }

  const deleteById = async (id: string) => {
    const u = await userService.deleteById(id)

    users.value = users.value.filter((user) => user.userId === id)
    
    return u.data
  }

  const updateById = async (data: FormData) => {
    const u = await userService.updateById(data)

    const index = users.value.findIndex((user) => data.get('userId') === user.userId)
    users.value[index] = u.data
    
    return u.data
  }
  
  return {
    getAll,
    getById,
    deleteById,
    updateById,
    users
  }
})

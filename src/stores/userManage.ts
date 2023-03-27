import { defineStore } from 'pinia'
import { computed, ref, reactive, toRaw } from 'vue'
import fetch from '@/request/fetch'

export const useUserManage = defineStore('UserManage', () => {
  const data = ref([])

  function initStore() {
    return fetch.get('/api/getAllUser').then((res) => {
      data.value = res
    })
  }

  function deleteUser(id: number) {
    fetch.delete(`/api/deleteUserPlate/${id}`).then((res) => {
      initStore()
    })
  }
  return { initStore, data, deleteUser }
})

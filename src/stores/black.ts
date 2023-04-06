import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { Notification } from '@arco-design/web-vue'
import fetch from '@/request/fetch'
export const useBlackStore = defineStore('black', () => {
  const state = ref()

  function initStore() {
    return fetch.get('/api/getAllBlack').then((res) => {
      const { result } = res
      state.value = result
    })
  }

  function deletedItem(id: number) {
    return fetch.delete(`/api/deleteBlack/${id}`).then((result) => {
      const { res } = result
      res && Notification.success('删除成功') && initStore()
    })
  }
  function editItem() {}
  return { state, initStore, deletedItem, editItem }
})

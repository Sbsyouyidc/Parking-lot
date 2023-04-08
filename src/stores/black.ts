import { computed, ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { Notification, Result } from '@arco-design/web-vue'
import fetch from '@/request/fetch'
export const useBlackStore = defineStore('black', () => {
  const state = ref()
  const form = ref<{
    id?: number
    licenseplate?: string
    Irregularities?: string
  }>({
    licenseplate: '',
    Irregularities: ''
  })

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

  function postItem(params: object) {
    return fetch.post('/api/postBlack', params).then((result) => {
      const { res } = result
      res && Notification.success('成功') && initStore()
    })
  }
  function putItem(params: object) {
    console.log(params)
    return fetch.put('/api/putBlack', params).then((result) => {
      const { res } = result
      res && Notification.success('成功') && initStore()
    })
  }
  return { state, initStore, deletedItem, putItem, postItem, form }
})

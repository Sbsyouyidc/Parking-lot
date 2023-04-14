import { computed, ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { Notification, Result } from '@arco-design/web-vue'
import fetch from '@/request/fetch'
import dayjs from 'dayjs'

type Iform = {
  id?: number
  licenseplate?: string
  Irregularities?: string
  dateTime?: string
}
export const useBlackStore = defineStore('black', () => {
  const state = ref()
  const form = ref<Iform>({
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
  function putItem(params: Iform) {
    params.dateTime = dayjs(params.dateTime).format('YYYY-MM-DD HH:mm:ss')
    return fetch.put('/api/putBlack', params).then((result) => {
      const { res } = result
      if (res) {
        Notification.success('成功')
        initStore()
        form.value = {}
      } else {
        Notification.success('失败')
      }
    })
  }
  return { state, initStore, deletedItem, putItem, postItem, form }
})

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
  status?: number
}
export const useBlackStore = defineStore('black', () => {
  const state = ref()
  const form = ref<Iform>({
    licenseplate: '',
    Irregularities: '',
    status: 0
  })
  const status = [
    { label: '待处理', value: 0, color: '#f53f3f' },
    { label: '已处理', value: 1, color: '#00b42a' }
  ]
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

  function blackArray(input: string) {
    return fetch.get(`api/getBlackPlate?plate=${input}`).then((result) => {
      return result
    })
  }
  return { state, initStore, deletedItem, putItem, postItem, form, status, blackArray }
})

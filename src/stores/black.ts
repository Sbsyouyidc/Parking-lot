import { computed, ref, reactive, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { Notification, Message } from '@arco-design/web-vue'
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
  const plateBlack = ref<
    {
      Irregularities: string
      dateTime: string
      id: number
      licenseplate: string
      status: number
    }[]
  >([])
  const handlingArr = ref<any[]>([])
  const status = [
    { label: '待处理', value: 0, color: '#f53f3f' },
    { label: '需处理', value: 1, color: '#ffb400' },
    { label: '已处理', value: 2, color: '#00b42a' }
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
      plateBlack.value = result.arr
    })
  }

  const filterBlack = computed(() =>
    plateBlack.value.filter((item: { status: number }) => item.status !== 2)
  )
  const UntreatedBlack = computed(() =>
    plateBlack.value.filter((item: { status: number }) => item.status == 2)
  )

  function blackProcess() {
    fetch
      .put('/api/postBlackProcess', { params: JSON.stringify(toRaw(handlingArr.value)) })
      .then((result) => {
        result.res && Message.success('已提交申请')
      })
  }
  return {
    state,
    initStore,
    deletedItem,
    putItem,
    postItem,
    form,
    status,
    blackArray,
    plateBlack,
    filterBlack,
    UntreatedBlack,
    handlingArr,
    blackProcess
  }
})

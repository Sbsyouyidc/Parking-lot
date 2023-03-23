import { computed, ref, reactive, toRaw } from 'vue'
import { defineStore } from 'pinia'
import fetch from '@/request/fetch'
import { Message } from '@arco-design/web-vue'
export type IData = {
  EndParkingTime: string
  ParkingPlate: string
  StartParkingTime: string
  coordinates: { X: number; Y: number }
  creationTime: string
  id: any
  number: string
  status: string
  type: string
}

export const useManaGement = defineStore('management', () => {
  const curItem = reactive({
    EndParkingTime: '',
    ParkingPlate: '',
    StartParkingTime: '',
    coordinates: { X: 0, Y: 0 },
    creationTime: '',
    id: '',
    number: '',
    status: 'true',
    type: ''
  })

  const data = ref<IData[]>([])

  const Order = ref([])
  function initStore() {
    return Promise.all([fetch.get('/api/parkingSpace'), fetch.get('/api/getAllOrder')]).then(
      ([res, obj]) => {
        data.value = res
        Order.value = obj.data
      }
    )
  }

  function save(): Promise<void> {
    return fetch
      .post('/api/postSaveParking', { params: JSON.stringify(data.value) })
      .then((results) => {
        const { res, message } = results
        res && Message.success(message)
      })
  }

  const orderOptions = computed(() => {
    const res = []
    for (const key in Order.value) {
      const params = {
        label: key
      }
      res.push(params)
    }
    return res
  })
  return { curItem, initStore, save, data, Order, orderOptions }
})

import { computed, ref, reactive, toRaw } from 'vue'
import { defineStore } from 'pinia'
import fetch from '@/request/fetch'
import { Message } from '@arco-design/web-vue'
export type IData = {
  EndParkingTime: string
  ParkingPlate: string
  StartParkingTime: string
  coordinates: { X: number; Y: number; degree?: number }
  creationTime: string
  id?: number
  index?: number
  number: string
  status: string
  type: string
}

export const useManaGement = defineStore('management', () => {
  const curItem = ref<IData>({
    EndParkingTime: '',
    ParkingPlate: '',
    StartParkingTime: '',
    coordinates: { X: 0, Y: 0, degree: 0 },
    creationTime: '',
    number: '',
    status: 'true',
    type: '',
    
  })

  const data = reactive<{ oldItem: IData[]; newItem: IData[]; deletedItem: IData[] }>({
    oldItem: [],
    newItem: [],
    deletedItem: []
  })

  const Order = ref([])

  function initStore() {
    return Promise.all([fetch.get('/api/parkingSpace'), fetch.get('/api/getAllOrder')]).then(
      ([res, obj]) => {
        data.newItem = []
        data.deletedItem = []
        data.oldItem = res
        Order.value = obj.data
      }
    )
  }

  function save(): Promise<void> {
    return fetch.post('/api/postSaveParking', { params: JSON.stringify(data) }).then((results) => {
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

  function deleteItem(id: number) {
    console.log(id)

    data.deletedItem.push(data.oldItem.find((item) => item.id == id) as IData)
    data.oldItem = data.oldItem.filter((item) => item.id !== id)
  }

  const concatData = computed(() => [...data.oldItem, ...data.newItem])
  return { curItem, initStore, save, data, Order, orderOptions, deleteItem, concatData }
})

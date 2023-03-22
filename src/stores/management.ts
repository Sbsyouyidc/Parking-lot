import { computed, ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import fetch from '@/request/fetch'

type IData = {
  EndParkingTime: string
  ParkingPlate: string
  StartParkingTime: string
  coordinates: { X: number; Y: number }
  creationTime: string
  id: number | string
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

  function initStore(): Promise<void> {
    return fetch.get('/api/parkingSpace').then((res) => {
      data.value = res
    })
  }
  return { curItem, initStore, data }
})

import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import fetch from '@/request/fetch'

export type IParkSpaces =
  | {
      id: string
      number: string
      status: string
      ParkingPlate: string
      type: string
      creationTime: string
      plate: string
    }[]
  | []

export const useParkInfoStore = defineStore('parkInfo', () => {
  const state = ref<IParkSpaces>([])
  const plate = ref()
  const spaceNumber = ref()
  const initStore = () => {
    spaceNumber.value = localStorage.getItem('number')
    plate.value = localStorage.getItem('plate')
    return fetch.get('/api/parkingSpace').then((res) => {
      state.value = res
    })
  }
  return { initStore, state, spaceNumber, plate }
})

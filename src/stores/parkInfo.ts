import { ref, computed, reactive, watch } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import fetch from '@/request/fetch'
import { Duration } from '@/util/index'
import type { IData } from './management'
export const useParkInfoStore = defineStore('parkInfo', () => {
  const state = ref<IData[]>([])
  const plate = ref()
  const spaceNumber = ref()
  const type = ref()
  const parkingData = ref({
    number: '',
    start: '',
    end: '',
    Price: '',
    duration: '',
    type: ''
  })

  function initStore(): Promise<void> {
    spaceNumber.value = localStorage.getItem('spaceNumber')
    plate.value = localStorage.getItem('plate')
    return fetch.get('/api/parkingSpace').then((res) => {
      state.value = res
    })
  }

  setInterval(() => {
    parkingData.value.duration = Duration(dayjs().diff(dayjs(parkingData.value.start))) as string
  }, 1000)

  function VehicleDeparture(): Promise<void> {
    if (parkingData.value.start) {
      parkingData.value.end = dayjs().format('YYYY-MM-DD HH:mm:ss')

      return Promise.resolve()
    } else {
      return fetch
        .get(`/api/parkingSpace/VehicleDuration?number=${spaceNumber.value}`)
        .then((result: any) => {
          const { res } = result
          if (res) {
            parkingData.value = result
          }
        })
    }
  }

  return { initStore, VehicleDeparture, state, spaceNumber, plate, parkingData, type }
})

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
  const ChargeDetails = ref<{
    Price: string
    PriceDetails: { [key: string]: string }[]
  }>({ Price: '', PriceDetails: [] })

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
    if (spaceNumber.value) {
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
    } else {
      return Promise.resolve()
    }
  }

  //搜索车位
  function searchSpace(type: string, id: string) {
    console.log(type, id)
    if (id && type) {
      fetch.get(`/api/getSearchPark?${type}=${id}`).then((result) => {
        state.value = result
      })
    } else {
      initStore()
    }
  }

  //搜索
  function search(id: string) {
    fetch.get(`/api/getChargeDetails?id=${id}`).then((result) => {
      const { PriceDetails, Price } = result
      ChargeDetails.value = { PriceDetails, Price }
    })
  }

  return {
    initStore,
    VehicleDeparture,
    searchSpace,
    search,
    state,
    spaceNumber,
    plate,
    parkingData,
    type,
    ChargeDetails
  }
})

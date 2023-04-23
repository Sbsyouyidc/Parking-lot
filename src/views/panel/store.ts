import { ref, computed, reactive, watch } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import fetch from '@/request/fetch'
export const useShowPanelStore = defineStore('showPanel', () => {
  const state = ref([])
  const cartNumber = ref<any[]>([])
  function initStore(): Promise<void> {
    return fetch.get('/api/parkingSpace').then((res) => {
      state.value = res.filter((item: { type: string }) => item.type !== 'static')
    })
  }
  function getOrderRecord(): Promise<void> {
    return fetch.get(`/api/getSearchOrder`).then((res: any[]) => {
      res.forEach((item: { [key: string]: any }) => {
        const { StartParkingTime, EndParkingTime, conditionTime } = item
        item.StartParkingTime = dayjs(StartParkingTime).format('YYYY-MM-DD ')
        item.EndParkingTime = dayjs(EndParkingTime).format('YYYY-MM-DD ')
        item.conditionTime = dayjs(conditionTime).format('YYYY-MM-DD ')
      })
      cartNumber.value = res
    })
  }
  const detail = computed(() => [
    {
      label: '全部车位',
      num: state.value.length
    },
    {
      label: '停放车位',
      num: state.value.filter((item: { ParkingPlate: any }) => item.ParkingPlate).length
    },
    {
      label: '未停放车位',
      num: state.value.filter((item: { ParkingPlate: any }) => item.ParkingPlate == null).length
    }
  ])

  const admissionArray = computed(() =>
    cartNumber.value.reduce((left, right) => {
      if (!left[right.StartParkingTime]) {
        left[right.StartParkingTime] = 1
      }
      left[right.StartParkingTime]++
      return left
    }, {})
  )

  return { state, initStore, detail, cartNumber, getOrderRecord, admissionArray }
})

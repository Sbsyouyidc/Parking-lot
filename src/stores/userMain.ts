import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useParkInfoStore } from '@/stores/parkInfo'

export const useUserMainStore = defineStore('userMain', () => {
  const mySate = ref<{ [key: string]: string }>({})
  const filter = computed(() => {
    const store = useParkInfoStore()
    return store.state.filter((item) => item.ParkingPlate == plate.value)
  })
  const plate = computed(() => localStorage.getItem('plate'))

  const type = computed(() => filter.value[0].type)

  function init() {
    mySate.value = JSON.parse(localStorage.getItem('myState') as string)
  }
  return { plate, filter, type, mySate, init }
})

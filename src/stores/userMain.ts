import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useParkInfoStore } from '@/stores/parkInfo'

export const useUserMainStore = defineStore('userMain', () => {
  const filter = computed(() => {
    const store = useParkInfoStore()
    return store.state.filter((item) => item.ParkingPlate == plate.value)
  })
  const plate = computed(() => localStorage.getItem('plate'))

  const type = computed(() => filter.value[0].type)
  return { plate, filter, type }
})

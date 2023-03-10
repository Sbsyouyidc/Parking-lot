import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import fetch from '@/request/fetch'
export const useParkInfoStore = defineStore('parkInfo', () => {
  const state = ref([])
  const initStore = () => {
    return fetch.get('/api/parkingSpace').then((res) => {
      state.value = res
    })
  }
  return { initStore, state }
})

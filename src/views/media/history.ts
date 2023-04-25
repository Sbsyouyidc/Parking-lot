import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import fetch from '@/request/fetch'
export const useHistoryStore = defineStore('history', () => {
  const state = ref<any[]>([])
  const init = () => {
    fetch.get('/api/history').then((res) => {
      state.value = res
    })
  }
  return { state, init }
})

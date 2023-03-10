import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)
  const changeLoading = () => {
    isLoading.value = !isLoading.value
  }
  return { isLoading, changeLoading }
})

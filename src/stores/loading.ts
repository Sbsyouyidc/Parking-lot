import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('loading', () => {
  const isLoading = ref(false)
  const changeLoading = () => {
    isLoading.value = !isLoading.value
  }
  const getLoading = computed(() => isLoading.value)
  return { isLoading, changeLoading, getLoading }
})

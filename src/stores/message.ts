import { ref, computed, reactive, watch } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import fetch from '@/request/fetch'
import type { IData } from './management'
import { Message, Notification } from '@arco-design/web-vue'

export const useMessageStore = defineStore('message', () => {
  const limit = ref<number>(10000000)
  const state = ref({
    abnormal: '',
    Appointment: ''
  })

  function postMessage(type: string, text: string) {
    const params = {
      type,
      text
    }
    return fetch.post('/api/postMessage', params, false).then((result) => {
      console.log(result)
      result.res && Notification.warning(result.message)
    })
  }
  function init() {
    return fetch.get('/api/getAllMessage').then((result) => {
      const { res } = result
      state.value = res
    })
  }

  function deleteMessage(id: number) {
    return fetch.delete(`/api/deleteMessage/${id}`).then((result) => {
      const { res } = result
      res && Message.success('删除成功') && init()
    })
  }
  const abnormal = computed(() => state.value.abnormal)
  const Appointment = computed(() => state.value.Appointment)
  return { limit, postMessage, init, state, abnormal, Appointment, deleteMessage }
})

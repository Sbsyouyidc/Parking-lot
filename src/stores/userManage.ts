import { defineStore } from 'pinia'
import { computed, ref, reactive, toRaw } from 'vue'
import fetch from '@/request/fetch'
import { Message } from '@arco-design/web-vue'
export const useUserManage = defineStore('UserManage', () => {
  const data = ref([])
  const visible = ref(false)
  const form = ref<{ username: string; password: string; type: string; image?: ''; Id?: '' }>({
    username: '',
    password: '',
    type: '',
    image: ''
  })
  const type = ref()
  const file = computed(() => {
    if (type.value == 'edit') {
      return [
        {
          name: form.value.image,
          url: `http://localhost:3000/static/images/${form.value.image}`
        }
      ]
    } else {
      return []
    }
  })
  function initStore() {
    return fetch.get('/api/getAllUser').then((res) => {
      data.value = res
    })
  }

  function deleteUser(id: number) {
    fetch.delete(`/api/deleteUserPlate/${id}`).then((res) => {
      initStore()
    })
  }
  function options() {
    const option = type.value == 'add' ? 'postNewUser' : 'putUpdateUser'
    const method = type.value == 'add' ? 'post' : 'put'
    fetch[`${method}`](`/api/${option}`, toRaw(form.value)).then((result: any) => {
      const { res, message } = result
      ;(res && initStore()) || Message.error(message)
    })
  }

  function edit(params: any) {
    type.value = 'edit'
    form.value = params
    visible.value = !visible.value
  }

  return { initStore, data, deleteUser, visible, form, edit, file, type, options }
})

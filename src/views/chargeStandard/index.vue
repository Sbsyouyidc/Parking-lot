<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onActivated } from 'vue'
import Charge from './Charge.vue'
import fetch from '@/request/fetch'
import { Message } from '@arco-design/web-vue'
import type { ValidatedError } from '@arco-design/web-vue/es/form/interface'

const data = ref<{
  [key: string]: {
    group: any[]
  }
}>({})
onActivated(() => {
  getAllOrder()
})
const getAllOrder = () => {
  return fetch.get('/api/getAllOrder').then((res: any) => {
    data.value = res.data
  })
}
const visible = ref(false)
const formRef = ref()

const form = reactive({
  type: ''
})

const save = () => {
  fetch.post('/api/postSaveOrder', { params: JSON.stringify(data.value) }).then(() => {
    getAllOrder()
  })
}

const addItem = (item: object, type: string) => {
  data.value[type].group.push(item)
}

const deleteItem = (index_0: number, type: string) => {
  data.value[type].group = data.value[type].group.filter((item: any, index) => index !== index_0)
}

const handleOk = () => {
  fetch
    .post('/api/postNewType', { type: form.type })
    .then(async (result: { res: any; message: any }) => {
      const { res, message } = result
      if (res) {
        Message.success(message)
        await getAllOrder()
        visible.value = false
      } else {
        Message.error(message)
      }
    })
}

const before = () => {
  return new Promise<void>((resolve, reject) => {
    formRef.value.validate((errors: undefined | Record<string, ValidatedError>) => {
      if (errors) {
        reject()
      } else {
        resolve()
      }
    })
  })
}

const allDelete = (type: string) => {
  fetch.delete(`/api/deleType/${type}`).then(async () => {
    await getAllOrder()
  })
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    @ok="handleOk"
    @cancel="() => (visible = false)"
    :on-before-ok="before"
    simple
  >
    <a-form :model="form" ref="formRef">
      <a-form-item
        field="type"
        label="类别名"
        :rules="[{ required: true, message: 'must select one' }]"
      >
        <a-input v-model="form.type" placeholder="请输入类别名" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-space>
    <a-button @click="save" type="primary">保存</a-button>
    <a-button @click="() => (visible = !visible)">新建类别标准</a-button>
  </a-space>

  <Charge :data="data" @on-addItem="addItem" @on-delete="deleteItem" @on-allDelete="allDelete" />
</template>
<style lang="less" scoped></style>

<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onActivated } from 'vue'
import Charge from './Charge.vue'
import fetch from '@/request/fetch'

const data = ref<{
  [key: string]: {
    group: any[]
  }
}>({})
onActivated(() => {
  fetch.get('/api/getAllOrder').then((res: any) => {
    data.value = res.data
  })
})
const save = () => {
  console.log(data)

  // fetch.post('/api/postSaveOrder', { params: JSON.stringify(data.value) }).then(() => {})
}
</script>

<template>
  <a-button @click="save" type="primary">保存</a-button>
  <Charge :data="data" />{{ data }}
</template>
<style lang="less" scoped></style>

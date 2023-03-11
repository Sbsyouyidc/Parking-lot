<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import parkSpace from '@/views/cardAccess/parkSpace.vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import { onMounted } from 'vue'
import fetch from '@/request/fetch'
import { Message } from '@arco-design/web-vue'

const data = ref({
  number: '',
  start: '',
  end: '',
  Price: '',
  duration: ''
})
const store = useParkInfoStore()
onMounted(async () => {
  await store.initStore()
})

const VehicleDeparture = () => {
  visible.value = true
  fetch
    .put(`/api/parkingSpace/VehicleDeparture/${store.spaceNumber}/${store.plate}`)
    .then((result: any) => {
      const { res } = result
      if (res) {
        data.value = result
      }
    })
}

const visible = ref(false)

const handleOk = () => {
  localStorage.setItem('number', '')
  store.initStore()
  Message.success('成功')
  visible.value = false
}
const handleCancel = () => {
  visible.value = false
}
</script>

<template>
  <a-modal
    modal-class="modal"
    v-model:visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    title-align="start"
  >
    <template #title>车辆离场</template>
    <a-descriptions :data="data" layout="inline-vertical" bordered>
      <a-descriptions-item label="停车位">{{ data.number }}</a-descriptions-item>
      <a-descriptions-item label="停车费用" span="2">{{ data.Price }}</a-descriptions-item>
      <a-descriptions-item label="开始时间" span="2">{{ data.start }}</a-descriptions-item>
      <a-descriptions-item label="结束时间" span="2">{{ data.end }}</a-descriptions-item>
      <a-descriptions-item label="停放时长">{{ data.duration }}</a-descriptions-item>
    </a-descriptions>
  </a-modal>
  <a-button type="primary" @click="VehicleDeparture" :disabled="!store.spaceNumber"
    >车辆离场</a-button
  >
  <div class="cart-item">
    <div v-for="(item, index) in store.state" :key="index">
      <parkSpace :number="item.number" :id="item.id" :plate="item.ParkingPlate" />
    </div>
  </div>
</template>
<style lang="less" scoped>
.cart-item {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
:deep(.arco-modal .modal) {
  background-color: red;
  .arco-modal-footer {
    border-top: 3px solid red;
    background-color: aqua;
  }
}
</style>

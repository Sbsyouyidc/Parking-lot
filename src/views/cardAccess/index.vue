<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import parkSpace from '@/views/cardAccess/parkSpace.vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import { onActivated } from 'vue'
import fetch from '@/request/fetch'
import spaceDetail from './spaceDetail.vue'
onActivated(async () => {
  await store.initStore()
  await store.VehicleDeparture()

})

const visible = ref(false)
const store = useParkInfoStore()
const ChargeData = ref({
  number: '',
  start: '',
  end: '',
  price: '',
  duration: ''
})

const VehicleDeparture = () => {
  visible.value = true
  fetch
    .put(`/api/parkingSpace/VehicleDeparture/${store.spaceNumber}`, {
      plate: store.plate,
      type: store.type
    })
    .then((result: any) => {
      const { res } = result
      if (res) {
        localStorage.setItem('spaceNumber', '')
        ChargeData.value = result
        store.parkingData = { number: '', start: '', end: '', Price: '', duration: '', type: '' }
        store.initStore()
      }
    })
}
</script>

<template>
  <a-modal
    modal-class="modal"
    v-model:visible="visible"
    @ok="
      () => {
        visible = false
      }
    "
    @cancel="() => (visible = false)"
    title-align="start"
  >
    <template #title>车辆离场</template>
    <a-descriptions layout="inline-vertical" bordered>
      <a-descriptions-item label="停车位">{{ ChargeData.number }}</a-descriptions-item>
      <a-descriptions-item label="停车费用" span="2">{{ ChargeData.price }}</a-descriptions-item>
      <a-descriptions-item label="开始时间" span="2">{{ ChargeData.start }}</a-descriptions-item>
      <a-descriptions-item label="结束时间" span="2">{{ ChargeData.end }}</a-descriptions-item>
      <a-descriptions-item label="停放时长">{{ ChargeData.duration }}</a-descriptions-item>
    </a-descriptions>
  </a-modal>

  <a-button type="primary" @click="VehicleDeparture" :disabled="!store.spaceNumber">离场</a-button>
  <spaceDetail />
  <div class="card-access">
    <parkSpace :item="item" v-for="(item, index) in store.state" :key="index" />
  </div>
</template>
<style lang="less" scoped>
.card-access {
  position: relative;
  height: 600px;
  margin: 10px;
  background-color: #f0eeee;
}
:deep(.arco-modal .modal) {
  background-color: red;
  .arco-modal-footer {
    border-top: 3px solid red;
    background-color: aqua;
  }
}
</style>

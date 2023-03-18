<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import parkSpace from '@/views/cardAccess/parkSpace.vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import { onActivated } from 'vue'
import fetch from '@/request/fetch'

onActivated(async () => {
  await store.initStore()
})

const visible = ref(false)
const visible1 = ref(false)
const store = useParkInfoStore()
const detailData = computed(() => store.parkingData)
const ChargeData = ref({
  number: '',
  start: '',
  end: '',
  Price: '',
  duration: ''
})

const Departure = () => {
  store.VehicleDeparture().then(() => {
    visible.value = true
  })
}

const VehicleDeparture = () => {
  visible1.value = true
  fetch
    .put(`/api/parkingSpace/VehicleDeparture/${store.spaceNumber}/${store.plate}`)
    .then((result: any) => {
      const { res } = result
      if (res) {
        localStorage.setItem('spaceNumber', '')
        ChargeData.value = result
        store.parkingData = { number: '', start: '', end: '', Price: '', duration: '', type: '' }
      }
    })
}
</script>

<template>
  <a-modal
    modal-class="modal"
    v-model:visible="visible"
    @ok="() => (visible = false)"
    @cancel="() => (visible = false)"
    title-align="start"
  >
    <template #title>停放详细</template>
    <a-descriptions layout="inline-vertical" bordered>
      <a-descriptions-item label="停车位">{{ detailData.number }}</a-descriptions-item>
      <a-descriptions-item label="车位类别">{{ detailData.type }}</a-descriptions-item>
      <a-descriptions-item label="开始时间">{{ detailData.start }}</a-descriptions-item
      ><a-descriptions-item label="停放时长">{{ detailData.duration }}</a-descriptions-item>
    </a-descriptions>
  </a-modal>
  <a-modal
    modal-class="modal"
    v-model:visible="visible1"
    @ok="
      () => {
        visible1 = false
        store.initStore()
      }
    "
    @cancel="() => (visible1 = false)"
    title-align="start"
  >
    <template #title>车辆离场</template>
    <a-descriptions layout="inline-vertical" bordered>
      <a-descriptions-item label="停车位">{{ ChargeData.number }}</a-descriptions-item>
      <a-descriptions-item label="停车费用" span="2">{{ ChargeData.Price }}</a-descriptions-item>
      <a-descriptions-item label="开始时间" span="2">{{ ChargeData.start }}</a-descriptions-item>
      <a-descriptions-item label="结束时间" span="2">{{ ChargeData.end }}</a-descriptions-item>
      <a-descriptions-item label="停放时长">{{ ChargeData.duration }}</a-descriptions-item>
    </a-descriptions>
  </a-modal>
  <a-button-group>
    <a-button @click="Departure" :disabled="!store.spaceNumber">停放详细</a-button>
    <a-button type="primary" @click="VehicleDeparture" :disabled="!store.spaceNumber"
      >离场</a-button
    ></a-button-group
  >

  <div class="cart-item">
    <div v-for="(item, index) in store.state" :key="index">
      <parkSpace :item="item" />
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

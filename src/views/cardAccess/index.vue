<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, computed, onMounted, onActivated } from 'vue'
import parkSpace from '@/views/cardAccess/parkSpace.vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import spaceAllDetail from './spaceAllDetail.vue'
import { storeToRefs } from 'pinia'
import { useUserMainStore } from '@/stores/userMain'
import modal from '@/components/Module/modal.vue'
import { emitter } from '@/util/index'
import fetch from '@/request/fetch'

onActivated(async () => {
  await store.initStore()
  emitter.on('leave', (res: any) => {
    VehicleDeparture(res.plate, res.status)
  })
})

const store = useParkInfoStore()
const userStore = useUserMainStore()
const { state } = storeToRefs(store)

const filter = computed(() => {
  if (userStore.plate) {
    return state.value.filter((item) => item.ParkingPlate == userStore.plate)
  } else {
    return state.value.filter((item) => item.ParkingPlate !== '' && item.ParkingPlate !== null)
  }
})

const ChargeData = ref({
  number: '',
  start: '',
  end: '',
  price: '',
  duration: ''
})

const visible = ref(false)

const VehicleDeparture = async (plate: any, status: string) => {
  console.log('asd')
  if (status == 'parked') {
    visible.value = true
  }
  if (status == 'appointment') {
    visible_m.value = true
  }
  fetch.put(`/api/parkingSpace/VehicleDeparture/${plate}`, { status }).then((result: any) => {
    const { res } = result
    if (res) {
      ChargeData.value = result
      store.parkingData = { number: '', start: '', end: '', Price: '', duration: '', type: '' }
      store.initStore()
    }
  })
}
const visible_m = ref(false)
</script>

<template>
  <a-modal
    width="auto"
    v-model:visible="visible"
    @ok="
      () => {
        store.initStore()
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
  <modal v-model:visible="visible_m">
    <div>预约取消成功</div>
  </modal>
  <a-typography-title :heading="6"> 预约列表 </a-typography-title>
  <spaceAllDetail v-for="(item, index) in filter" :key="index" :item="item" />
  <div class="card-access box-shadow-inset">
    <parkSpace :item="item" v-for="(item, index) in store.state" :key="index" />
  </div>
</template>
<style lang="less" scoped>
.card-access {
  overflow: auto;
  position: relative;

  height: 600px;
  margin: 10px;
  background-color: #f0eeee;
  border-radius: 5px;
}
:deep(.arco-modal .modal) {
  background-color: red;
  .arco-modal-footer {
    border-top: 3px solid red;
    background-color: aqua;
  }
}
</style>

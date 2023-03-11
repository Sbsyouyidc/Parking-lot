<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, watchEffect, onActivated } from 'vue'
import parkSpace from '@/views/cardAccess/parkSpace.vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import { onMounted } from 'vue'
import fetch from '@/request/fetch'
import { Message, Notification } from '@arco-design/web-vue'
const store = useParkInfoStore()
onMounted(async () => {
  await store.initStore()
})

const VehicleDeparture = () => {
  fetch.put(`/api/parkingSpace/VehicleDeparture/${store.spaceNumber}/${store.plate}`).then((result: any) => {
    const { res, message } = result
    if (res) {
      store.spaceNumber = ''
      store.initStore()
      Message.success(message)
    }
  })
}
</script>

<template>
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
</style>

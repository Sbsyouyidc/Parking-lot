<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import parkSpace from '@/views/cardAccess/parkSpace.vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import { onActivated } from 'vue'
import spaceAllDetail from './spaceAllDetail.vue'
import { storeToRefs } from 'pinia'
onActivated(async () => {
  await store.initStore()
  await store.VehicleDeparture()
})

const store = useParkInfoStore()

const { state } = storeToRefs(store)

const filter = computed(() =>
  state.value.filter((item) => item.ParkingPlate !== '' && item.ParkingPlate !== null)
)
</script>

<template>
  <spaceAllDetail v-for="(item, index) in filter" :key="index" :item="item" />
  <div class="card-access box-shadow-inset">
    <parkSpace :item="item" v-for="(item, index) in store.state" :key="index" />
  </div>
</template>
<style lang="less" scoped>
.card-access {
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

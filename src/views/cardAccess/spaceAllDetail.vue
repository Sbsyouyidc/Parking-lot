<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, toRefs, computed, onMounted } from 'vue'
import { emitter } from '@/util/index'
import { useParkInfoStore } from '@/stores/parkInfo'
import { useUserMainStore } from '@/stores/userMain'

import dayjs from 'dayjs'
import fetch from '@/request/fetch'

const userStore = useUserMainStore()
const store = useParkInfoStore()

const props = defineProps<{
  item: any
}>()

const { item } = toRefs(props)
const ChargeData = ref({
  number: '',
  start: '',
  end: '',
  price: '',
  duration: ''
})

const visible = ref(false)
const params = computed(() => {
  if (userStore.plate) {
    return {
      plate: userStore.plate,
      type: userStore.type
    }
  } else {
    return {
      plate: item.value.ParkingPlate,
      type: item.value.type
    }
  }
})

const VehicleDeparture = async (plate: any) => {
  visible.value = true
  fetch.put(`/api/parkingSpace/VehicleDeparture/${plate}`).then((result: any) => {
    const { res } = result
    if (res) {
      ChargeData.value = result
      store.parkingData = { number: '', start: '', end: '', Price: '', duration: '', type: '' }
    }
  })
}

onMounted(() => {
  emitter.on('leave', (res: any) => {
    VehicleDeparture(res)
  })
})
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

  <a-descriptions layout="vertical" bordered :column="{ xs: 3, lg: 5 }" align="center" size="small">
    <a-descriptions-item label="停车位">{{ item.number }}</a-descriptions-item>
    <a-descriptions-item label="车位类别">{{ item.type }}</a-descriptions-item>
    <a-descriptions-item label="车牌">{{ item.ParkingPlate }}</a-descriptions-item>
    <a-descriptions-item label="开始时间">{{
      dayjs(item.StartParkingTime).format('YYYY-MM-DD HH:mm:ss')
    }}</a-descriptions-item>
    ><a-descriptions-item label="操作">
      <a-button type="primary" @click="VehicleDeparture(item.ParkingPlate)"
        >取消预约</a-button
      ></a-descriptions-item
    >
  </a-descriptions>
</template>
<style lang="less" scoped>
.arco-descriptions {
  margin-right: 5px;
}
</style>

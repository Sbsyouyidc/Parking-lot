<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { Duration } from '@/util/index'
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
const params = ref({ plate: '', type: '' })
const visible = ref(false)
const VehicleDeparture = async (number: any) => {
  visible.value = true
  if (userStore.plate) {
    params.value = {
      plate: userStore.plate,
      type: userStore.type
    }
  } else {
    params.value = {
      plate: item.value.ParkingPlate,
      type: item.value.type
    }
  }
  fetch.put(`/api/parkingSpace/VehicleDeparture/${number}`, params.value).then((result: any) => {
    const { res } = result
    if (res) {
      ChargeData.value = result
      store.parkingData = { number: '', start: '', end: '', Price: '', duration: '', type: '' }
    }
  })
}

const duration = ref('')
setInterval(() => (duration.value = Duration(dayjs().diff(dayjs(item.value.StartParkingTime)))))
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

  <a-descriptions layout="inline-horizontal" bordered :column="1">
    <a-descriptions-item label="停车位">{{ item.number }}</a-descriptions-item>
    <a-descriptions-item label="车位类别">{{ item.type }}</a-descriptions-item>
    <a-descriptions-item label="车牌">{{ item.ParkingPlate }}</a-descriptions-item>
    <a-descriptions-item label="开始时间">{{
      dayjs(item.StartParkingTime).format('YYYY-MM-DD HH:mm:ss')
    }}</a-descriptions-item>
    <a-descriptions-item label="时长">{{ duration }}</a-descriptions-item
    ><a-descriptions-item label="操作">
      <a-button type="primary" @click="VehicleDeparture(item.number)"
        >离场</a-button
      ></a-descriptions-item
    >
  </a-descriptions>
</template>
<style lang="less" scoped>
.arco-descriptions {
  margin-right: 5px;
}
</style>

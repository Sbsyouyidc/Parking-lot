<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserMainStore } from '@/stores/userMain'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { Duration } from '@/util'
import fetch from '@/request/fetch'
const store = useUserMainStore()
const router = useRouter()
onMounted(() => {
  getOrderRecord()
})
const getOrderRecord = (): Promise<void> => {
  return fetch.get(`/api/getSearchOrder?${option.value}=${value.value}`).then((res: any[]) => {
    res.forEach((item: { [key: string]: any }) => {
      const { StartParkingTime, EndParkingTime, conditionTime } = item
      item.StartParkingTime = dayjs(StartParkingTime).format('YYYY-MM-DD HH:mm')
      item.EndParkingTime = dayjs(EndParkingTime).format('YYYY-MM-DD HH:mm')
      item.conditionTime = dayjs(conditionTime).format('YYYY-MM-DD HH:mm')
      const duration = Duration(dayjs(EndParkingTime).diff(dayjs(StartParkingTime)))
      item.duration = duration
    })
    value.value = ''
    option.value = ''
    data.value = res
  })
}
const filter = computed(() =>
  data.value.filter((item: { LicensePlate: string | null }) => item.LicensePlate == store.plate)
)
const data = ref<any>([])
const value = ref('')
const option = ref('')
const search = (id: string) => {
  console.log(id)

  router.push({ name: 'userFeeDetails', query: { id } })
}
</script>

<template>
  <div class="user-order-record">
    <a-card v-for="item in filter" :key="item.id" @click="search(item.id)"
      ><div>订单号 {{ item.id }}</div>
      <div>车牌号 {{ item.LicensePlate }}</div>
      <div>车位编号 {{ item.number }}</div>
      <div>
        <span>开始时间 {{ item.StartParkingTime }}</span>
        <span class="price"> 车费 ￥{{ item.Price }}</span>
      </div>
    </a-card>
  </div>
</template>
<style lang="less" scoped>
.arco-card {
  margin: 15px;
  & .price {
    float: right;
    font-weight: bold;
  }
}
</style>

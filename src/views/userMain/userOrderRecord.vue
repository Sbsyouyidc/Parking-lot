<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { IconEmpty } from '@arco-design/web-vue/es/icon'
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
    <div v-if="filter.length !== 0">
      <a-card v-for="item in filter" :key="item.id" @click="search(item.id)"
        ><div class="item">
          <div>订单号</div>
          <div>{{ item.id }}</div>
        </div>
        <div class="item">
          <div>车牌号</div>
          <div>{{ item.LicensePlate }}</div>
        </div>
        <div class="item">
          <div>车位编号</div>
          <div>{{ item.number }}</div>
        </div>
        <div>
          <div class="item">
            <div>开始时间</div>
            <div>{{ item.StartParkingTime }}</div>
          </div>
          <div class="price">车费 ￥{{ item.Price }}</div>
        </div>
      </a-card>
    </div>
    <a-result title="暂无订单" v-else>
      <template #icon>
        <IconEmpty />
      </template>
    </a-result>
  </div>
</template>
<style lang="less" scoped>
.arco-card {
  margin: 15px;
  .item {
    display: flex;
    justify-content: space-between;

    & div:nth-child(1) {
      color: var(--color-neutral-6);
    }
    & ~ & {
      margin-top: 5px;
    }
  }
  & .price {
    text-align: right;
    font-weight: bold;
  }
}
</style>

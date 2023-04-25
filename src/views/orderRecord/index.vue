<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import fetch from '@/request/fetch'
import { ref, reactive } from 'vue'
import { onMounted, onActivated, watchEffect } from 'vue'
import dayjs from 'dayjs'
import type { TableColumnData } from '@arco-design/web-vue/es/table'
import { Duration, spaceType } from '@/util'
onActivated(() => {
  getOrderRecord()
})
onMounted(() => {
  getOrderRecord()
})
const getOrderRecord = (): Promise<void> => {
  return fetch.get(`/api/getSearchOrder?${option.value}=${value.value}`).then((res: any[]) => {
    res.forEach((item: { [key: string]: any }) => {
      const { StartParkingTime, EndParkingTime, conditionTime, status } = item
      item.StartParkingTime = dayjs(StartParkingTime).format('YYYY-MM-DD HH:mm')
      item.EndParkingTime = dayjs(EndParkingTime).format('YYYY-MM-DD HH:mm')
      const duration =
        status == 'parked' ? Duration(dayjs(EndParkingTime).diff(dayjs(StartParkingTime))) : 0
      item.duration = duration
    })
    value.value = ''
    option.value = ''
    data.value = res.sort((a, b) => a - b)
  })
}
const pagination = { pageSize: 14 }

const data = ref<any>([])
const options = [
  {
    value: 'id',
    label: '订单号'
  },
  { value: 'LicensePlate', label: '车牌号' },
  { value: 'StartParkingTime', label: '开始时间' },
  { value: 'number', label: '停车位' }
]

const filterable = {
  filters: [
    {
      text: '预约',
      value: 'appointment'
    },
    {
      text: '停放',
      value: 'parked'
    }
  ],
  filter: (value: any, row: { status: any }) => row.status == value
}
const value = ref('')
const option = ref('')
</script>

<template>
  <a-input-group>
    <a-select
      allow-clear
      :options="options"
      :style="{ width: '120px' }"
      v-model:model-value="option"
      default-value=""
      placeholder="查询类别"
    />
    <a-input-search
      :style="{ width: '220px' }"
      button-text="搜索"
      search-button
      placeholder="查询条件"
      @search="getOrderRecord"
      v-model:model-value="value"
    />
  </a-input-group>

  <a-table :data="data" :pagination="pagination">
    <template #columns>
      <a-table-column title="订单号" data-index="id"></a-table-column>
      <a-table-column title="订单类型" :filterable="filterable" data-index="status">
        <template #cell="{ record }">{{ spaceType[record.status] }}</template></a-table-column
      >
      <a-table-column title="车牌号" data-index="LicensePlate"></a-table-column>
      <a-table-column title="停车位" data-index="number"></a-table-column>
      <a-table-column title="价格" data-index="Price"></a-table-column>
      <a-table-column title="时长" data-index="duration"></a-table-column>
      <a-table-column title="开始时间" data-index="StartParkingTime"></a-table-column>
      <a-table-column title="结束时间" data-index="EndParkingTime"></a-table-column>
    </template>
  </a-table>
</template>
<style lang="less" scoped>
.arco-input-group {
  margin-bottom: 20px;
}
.arco-input-search {
  margin-left: 5px;
}
:deep(.arco-select-view-single),
:deep(.arco-input-wrapper) {
  background: rgb(255, 255, 255);
}
</style>

<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import fetch from '@/request/fetch'
import { ref, reactive } from 'vue'
import { onMounted, onActivated, watchEffect } from 'vue'
import dayjs from 'dayjs'
import type { TableColumnData } from '@arco-design/web-vue/es/table'
import { Duration } from '@/util'
onActivated(() => {
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
const pagination = { pageSize: 14 }
const columns: TableColumnData[] = [
  {
    title: '订单号',
    dataIndex: 'id',
    align: 'center'
  },

  {
    title: '车牌号',
    dataIndex: 'LicensePlate',
    align: 'center'
  },
  {
    title: '停车位',
    dataIndex: 'number',
    align: 'center'
  },
  {
    title: '价格',
    dataIndex: 'Price',
    align: 'center'
  },
  {
    title: '时长',
    dataIndex: 'duration',
    align: 'center'
  },
  {
    title: '开始时间',
    dataIndex: 'StartParkingTime',
    align: 'center'
  },
  {
    title: '结束时间',
    dataIndex: 'EndParkingTime',
    align: 'center'
  },
  {
    title: '录入时间',
    dataIndex: 'conditionTime',
    align: 'center'
  }
]
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

const value = ref('')
const option = ref('')
</script>

<template>
  <a-space size="large">
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
  </a-space>

  <a-table :columns="columns" :data="data" :pagination="pagination" />
</template>
<style lang="less" scoped>
.arco-space {
  margin-bottom: 10px;
}
</style>

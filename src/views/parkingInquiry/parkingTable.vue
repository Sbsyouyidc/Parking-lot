<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import dayjs from 'dayjs'
import { Duration } from '@/util/index'
const store = useParkInfoStore()
onMounted(() => {
  store.initStore()
})

const formatDate = (date: string) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : ''
}

const filterable = {
  filters: [
    {
      text: '已停放',
      value: 'string'
    },
    {
      text: '未停放',
      value: 'object'
    }
  ],
  filter: (value: any, row: { ParkingPlate: any }) => typeof row.ParkingPlate == value
}
</script>

<template>
  <a-table
    :data="store.parkinfoArray"
    style="margin-top: 30px"
    :bordered="{ wrapper: true, cell: true }"
    :pagination="{ pageSize: 14 }"
  >
    <template #columns>
      <a-table-column title="编号" data-index="number"></a-table-column
      ><a-table-column title="收费标准" data-index="type"></a-table-column>
      <a-table-column title="停放详细" data-index="StartParkingTime">
        <a-table-column
          title="停放车辆"
          data-index="ParkingPlate"
          :filterable="filterable"
        ></a-table-column>
        <a-table-column title="开始时间">
          <template #cell="{ record }">
            {{ formatDate(record.StartParkingTime) }}
          </template>
        </a-table-column>
        <a-table-column title="停放时长">
          <template #cell="{ record }">
            {{ Duration(dayjs().diff(dayjs(record.StartParkingTime))) }}
          </template>
        </a-table-column></a-table-column
      >

      <a-table-column title="状态" data-index="status">
        <template #cell="{ record }">
          <a-switch disabled :default-checked="record.status == 'true' ? true : false" />
        </template>
      </a-table-column>
    </template>
  </a-table>
</template>
<style lang="less" scoped></style>

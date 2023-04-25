<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import dayjs from 'dayjs'
import duration from './duration.vue'
import tableImage from './image.vue'

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

const expandable = reactive({
  title: '车辆信息',
  width: 100
})
</script>

<template>
  <a-table
    :data="store.parkinfoArray"
    style="margin-top: 30px"
    :bordered="{ wrapper: true, cell: true }"
    :pagination="{ pageSize: 14 }"
    :expandable="expandable"
    row-key="id"
  >
    <template #columns>
      <a-table-column title="编号" data-index="number"></a-table-column
      ><a-table-column title="收费标准" data-index="type"></a-table-column>

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
          <duration :time="record.StartParkingTime" />
        </template>
      </a-table-column>

      <a-table-column title="状态" data-index="status">
        <template #cell="{ record }">
          <div>{{ record.status }}</div>
        </template>
      </a-table-column>
    </template>
    <template #expand-row="{ record }"> <tableImage :plate="record.ParkingPlate" /></template>
  </a-table>
</template>
<style lang="less" scoped></style>

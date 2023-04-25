<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, toRefs, computed, onMounted } from 'vue'
import { emitter } from '@/util/index'

import dayjs from 'dayjs'

const props = defineProps<{
  item: any
}>()

const { item } = toRefs(props)
</script>

<template>
  <a-descriptions
    layout="vertical"
    bordered
    :column="{ xs: 3, lg: 5 }"
    align="center"
    size="small"
    v-show="item.status == 'appointment'"
  >
    <a-descriptions-item label="停车位">{{ item.number }}</a-descriptions-item>
    <a-descriptions-item label="车位类别">{{ item.type }}</a-descriptions-item>
    <a-descriptions-item label="车牌">{{ item.ParkingPlate }}</a-descriptions-item>
    <a-descriptions-item label="预约时间">{{
      dayjs(item.StartParkingTime).format('YYYY-MM-DD HH:mm')
    }}</a-descriptions-item>
    ><a-descriptions-item label="操作">
      <a-button
        type="primary"
        @click="emitter.emit('leave', { plate: item.ParkingPlate, status: item.status })"
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

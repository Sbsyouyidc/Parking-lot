<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import { storeToRefs } from 'pinia'
const store = useParkInfoStore()
const { parkingData } = storeToRefs(store)
</script>

<template>
  <a-descriptions layout="inline-horizontal" bordered :column="{ xs: 1, md: 3, lg: 4 }">
    <a-descriptions-item label="停车位">{{ parkingData.number }}</a-descriptions-item>
    <a-descriptions-item label="车位类别">{{ parkingData.type }}</a-descriptions-item>
    <a-descriptions-item label="开始时间">{{ parkingData.start }}</a-descriptions-item
    ><a-descriptions-item label="停放时长">{{ parkingData.duration }}</a-descriptions-item>
  </a-descriptions>
</template>
<style lang="less" scoped></style>

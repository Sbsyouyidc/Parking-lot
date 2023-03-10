<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, watchEffect, onActivated } from 'vue'
import parkSpace from '@/components/Module/parkSpace.vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import { onMounted } from 'vue'

const store = useParkInfoStore()

onMounted(async () => {
  await store.initStore()
})
</script>

<template>
  <div v-for="(item, index) in store.state" :key="index">
    <parkSpace :number="item.number" :id="item.id" :plate="item.ParkingPlate" />
  </div>
</template>
<style lang="less" scoped></style>

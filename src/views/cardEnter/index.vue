<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, watchEffect, onActivated } from 'vue'
import parkSpace from '@/components/Module/parkSpace.vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import { onMounted } from 'vue'

const store = useParkInfoStore()
const parkSpaces = ref([])
onMounted(async () => {
  await store.initStore()
  parkSpaces.value = store.state
})
onActivated(() => {
  console.log('sd')
})
</script>

<template>
  <div v-for="(item, index) in parkSpaces" :key="index">
    <parkSpace />
  </div>
</template>
<style lang="less" scoped></style>

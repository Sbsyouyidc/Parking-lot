<script setup lang="ts">
import { useCounterStore } from '@/stores/loading'
const loading = useCounterStore()
</script>

<template>
  <RouterView></RouterView>
  <div class="spin" v-show="loading.getLoading">
    <a-spin :size="32" />
  </div>

  <!-- <Layout></Layout> -->
</template>

<style scoped lang="less">
.spin {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgba(255, 255, 255, 0.849);
}
.arco-spin {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>

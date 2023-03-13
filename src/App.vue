<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading'
const loading = useLoadingStore()
</script>

<template>
  <router-view></router-view>
  <div class="spin" v-show="loading.isLoading">
    <a-spin :size="32" />
  </div>

  <!-- <Layout></Layout> -->
</template>

<style scoped lang="less">
.spin {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 996;
  background-color: rgba(255, 255, 255, 0.849);
}
.arco-spin {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>

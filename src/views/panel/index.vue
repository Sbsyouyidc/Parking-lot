<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onActivated } from 'vue'
import ringEchart from './ringEchart.vue'
import { useShowPanelStore } from './store'
import { useRouter } from 'vue-router'

const store = useShowPanelStore()
const router = useRouter()

onActivated(() => {
  store.initStore()
})
</script>

<template>
  <div class="panel">
    <a-card title="车位数据">
      <template #extra>
        <a-link @click="router.push({ name: 'ParkingInquiry' })">查看详细</a-link>
      </template>
      <div class="show-item">
        <div class="showPanel" v-for="(item, index) of store.detail" :key="index">
          <div
            class="showPanel-body"
            :style="{ 'background-color': `rgb(var(--arcoblue-${6 - index}))` }"
          >
            <div class="title">{{ item.label }}</div>
            <div class="body">{{ item.num }}</div>
          </div>
        </div>
      </div>
    </a-card>
    <a-card title="车位分析" class="cart-number">
      <ringEchart :admissionArray="store.admissionArray"
    /></a-card>
  </div>
</template>
<style lang="less" scoped>
.show-item {
  display: flex;
  padding: 0 20px 0 20px;
  justify-content: space-around;
}
.showPanel {
  &-body {
    width: 50%;
    margin: 0 auto;
    padding: 10px;
    font-size: large;
    font-weight: bold;
    border-radius: 10px;
    color: white;
  }
  flex: 1;
}
.arco-card {
  margin-bottom: 20px;
}
</style>

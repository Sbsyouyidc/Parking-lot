<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserMainStore } from '@/stores/userMain'

const router = useRouter()
</script>

<template>
  <a-layout class="user-main" style="height: 100%">
    <a-layout-content>
      <keep-alive><RouterView /></keep-alive>
    </a-layout-content>
    <a-layout-footer
      ><div class="item" @click="router.push({ name: 'userCardAccess' })">选择车位</div>
      <a-divider direction="vertical" />
      <div class="item" @click="router.push({ name: 'userParkingInquiry' })">车位查询</div>
      <a-divider direction="vertical" />
      <div class="item" @click="router.push({ name: 'userOrderRecord' })">订单查询</div>
      <a-divider direction="vertical" />
      <div class="item" @click="router.push({ name: 'userMyInfo' })">我的</div></a-layout-footer
    >
  </a-layout>
</template>
<style lang="less" scoped>
.user-main :deep(.arco-layout-header),
.user-main :deep(.arco-layout-content) {
  overflow: auto;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-stretch: condensed;
}
.user-main :deep(.arco-layout-footer) {
  width: 100%;
  z-index: 1000;
  position: fixed;
  bottom: 0px;
  display: flex;
  background-color: #f2f3f5;
  flex-direction: row;
  justify-content: space-between;
  font-size: 12px;
  align-items: center;
  font-stretch: condensed;

  & .item {
    flex: 1;
    line-height: 64px;
    text-align: center;
  }
}

.user-main :deep(.arco-layout-content) {
  padding-top: 10px;
  padding-bottom: 64px;
}

.user-main :deep(.arco-layout-footer) {
  height: 64px;
}
</style>

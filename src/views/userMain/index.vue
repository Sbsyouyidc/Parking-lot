<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, watch, onMounted, watchEffect, nextTick } from 'vue'
import { useUserMainStore } from '@/stores/userMain'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
const store = useUserMainStore()
const router = useRouter()
const route = useRoute()
onMounted(() => {
  store.init()
})
const menu = ref()

watchEffect(() => {
  console.log(route.meta.title)
  nextTick(() => {
    for (const key of document.getElementsByClassName('menu-item')) {
      if (key.innerHTML == route.meta.title) {
        key.style.borderBottom = '2px solid #5488f0'
      } else {
        key.style.borderBottom = 'none'
      }
    }
  })
})
</script>

<template>
  <a-layout class="user-main" style="height: 100%">
    <a-layout-header class="box-shadow">{{ route.meta.title }} </a-layout-header>
    <div class="menu" ref="menu">
      <div class="menu-item" @click="router.push({ name: 'userCardAccess' })">预约车位</div>
      <div class="menu-item" @click="router.push({ name: 'userParkingInquiry' })">车位查询</div>
      <div class="menu-item" @click="router.push({ name: 'userOrderRecord' })">订单记录</div>
      <div class="menu-item" @click="router.push({ name: 'userMyInfo' })">我的信息</div>
    </div>
    <a-layout-content>
      <keep-alive><RouterView /></keep-alive>
    </a-layout-content>
    <a-layout-footer></a-layout-footer>
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
}

.user-main :deep(.arco-layout-content) {
  padding-top: 10px;
  padding-bottom: 64px;
}

.user-main :deep(.arco-layout-footer) {
  height: 34px;
}
.user-main :deep(.arco-layout-header) {
  text-align: center;
  margin-bottom: 2px;
  line-height: 45px;
}

.menu {
  display: flex;

  & .menu-item {
    height: 30px;

    font-size: 4vw;
    padding: 10px 10px 30px 10px;
  }
}
</style>

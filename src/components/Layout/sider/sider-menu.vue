<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { IconApps } from '@arco-design/web-vue/es/icon'

const router = useRouter()
const emit = defineEmits<{ (e: 'on-collapse', name: boolean): void }>()
const onCollapse = () => {
  emit('on-collapse', true)
}

const click = (key: string) => {
  router.push({ name: key })
}
</script>

<template>
  <div class="sider-menu">
    <a-menu
      :style="{ width: '200px', height: '100%' }"
      :default-open-keys="['0']"
      show-collapse-button
      breakpoint="md"
      auto-switch
      @menu-item-click="click"
      @collapse="onCollapse"
    >
      <a-sub-menu key="0">
        <template #icon><icon-apps></icon-apps></template>
        <template #title>车场管理</template>
        <a-menu-item key="cardAccess">车辆出入</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="1">
        <template #icon><icon-apps></icon-apps></template>
        <template #title>信息查询管理</template>
        <a-menu-item key="orderRecord">订单记录</a-menu-item>
        <a-menu-item key="ParkingInquiry">车位查询</a-menu-item>
        <a-menu-item key="FeeDetails">收费明细</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="2">
        <template #icon><icon-apps></icon-apps></template>
        <template #title>信息维护管理</template>
        <a-menu-item key="UserManagement">用户管理</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="3">
        <template #icon><icon-apps></icon-apps></template>
        <template #title>系统管理</template>
        <a-menu-item key="BlackList">违规异常管理</a-menu-item>
        <a-menu-item key="chargeStandard">收费标准管理</a-menu-item>
        <a-menu-item key="ParkingManagement">车位管理</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>
<style lang="less" scoped></style>

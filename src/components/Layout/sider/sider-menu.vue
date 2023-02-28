<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  IconMenuFold,
  IconMenuUnfold,
  IconApps,
  IconBug,
  IconBulb
} from '@arco-design/web-vue/es/icon'
const router = useRouter()
const emit = defineEmits<{ (e: 'on-collapse', name: boolean): void }>()
const onCollapse = (val: boolean, type: string) => {
  emit('on-collapse', true)
}
const selectedKeys = ref('')
watch(selectedKeys, (key) => {
  router.push({ name: key[0] })
})
</script>

<template>
  <div class="sider-menu">
    <a-menu
      :style="{ width: '200px', height: '100%' }"
      :default-open-keys="['0']"
      :default-selected-keys="['0_2']"
      show-collapse-button
      breakpoint="md"
      auto-switch
      v-model:selected-keys="selectedKeys"
      @collapse="onCollapse"
    >
      <a-sub-menu key="0">
        <template #icon><icon-apps></icon-apps></template>
        <template #title>车场管理</template>
        <a-menu-item key="cardEntry">车辆入场</a-menu-item>
        <a-menu-item key="cardLeave">车辆离场</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="1">
        <template #icon><icon-apps></icon-apps></template>
        <template #title>信息查询管理</template>
        <a-menu-item key="1_0">车位查询</a-menu-item>
        <a-menu-item key="1_1">收费明细</a-menu-item>
        <a-menu-item key="1_2">订单记录</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="2">
        <template #icon><icon-apps></icon-apps></template>
        <template #title>信息维护管理</template>
        <a-menu-item key="2_0">个人信息</a-menu-item>
        <a-menu-item key="2_0">用户管理</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="3">
        <template #icon><icon-apps></icon-apps></template>
        <template #title>系统管理</template>
        <a-menu-item key="3_0">黑名单管理</a-menu-item>
        <a-menu-item key="3_1">收费标准管理</a-menu-item>
        <a-menu-item key="3_2">车位管理</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>
<style lang="less" scoped></style>

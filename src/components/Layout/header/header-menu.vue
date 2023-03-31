<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const click = (key: string) => {
  router.push({ name: key })
}
</script>

<template>
  <div class="menu">
    <a-menu mode="horizontal" @menu-item-click="click" :default-selected-keys="['1']">
      <a-menu-item key="0" :style="{ padding: 0, marginRight: '38px' }" disabled> </a-menu-item>
      <a-menu-item key="1">Home</a-menu-item>
      <a-menu-item key="userMain">Solution</a-menu-item>
    </a-menu>
  </div>
</template>
<style lang="less" scoped>
.menu {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ffffff;
}
</style>

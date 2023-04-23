<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const click = (key: string) => {
  router.push({ name: key })
}

const logout = () => {
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="menu">
    <a-menu mode="horizontal" @menu-item-click="click" :default-selected-keys="['1']">
      <a-menu-item key="0" :style="{ padding: 0, marginRight: '38px' }" disabled>
        router.meta</a-menu-item
      >
      <a-menu-item key="Home">管理员</a-menu-item>
      <a-menu-item key="userMain">用户</a-menu-item>
      <a-menu-item key="Panel">面版</a-menu-item>
      <a-menu-item key="Message">消息通知</a-menu-item>
    </a-menu>
    <a-button class="logout" @click="logout">退出</a-button>
  </div>
</template>
<style lang="less" scoped>
.menu {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: #ffffff;
}
.logout {
  margin-right: 10px;
  width: 50px;
}
</style>

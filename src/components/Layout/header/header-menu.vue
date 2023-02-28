<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
</script>

<template>
  <div class="menu">
    <a-menu mode="horizontal" :default-selected-keys="['1']">
      <a-menu-item key="0" :style="{ padding: 0, marginRight: '38px' }" disabled>
        <div
          :style="{
            width: '80px',
            height: '30px',
            borderRadius: '2px',
            background: 'var(--color-fill-3)',
            cursor: 'text'
          }"
        />
      </a-menu-item>
      <a-menu-item key="1">Home</a-menu-item>
      <a-menu-item key="2">Solution</a-menu-item>
      <a-menu-item key="3">Cloud Service</a-menu-item>
      <a-menu-item key="4">Cooperation</a-menu-item>
    </a-menu>
    <div class="right-option">
      <a-avatar>
        <img
          alt="avatar"
          src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
        />
      </a-avatar>
    </div>
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
.right-option {
  margin: 8px;
}
</style>

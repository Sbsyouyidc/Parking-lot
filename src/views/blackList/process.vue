<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useBlackStore } from '@/stores/black'
import { ref, reactive } from 'vue'
const store = useBlackStore()
</script>

<template>
  <div class="process">
    <div>待处理记录</div>
    <div class="body"></div>
  </div>
</template>
<style lang="less" scoped>
.process {
  overflow-y: auto;
  margin-right: 20px;
  padding: 5px;
  height: 500px;
  width: 200px;
  background-color: var(--color-neutral-2);
  border: 1px solid var(--color-neutral-3);
}
</style>

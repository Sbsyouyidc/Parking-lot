<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
</script>

<template>
  <div class="Item">
    <a-space>
      <a-input :style="{ width: '120px' }" placeholder="Please enter something" allow-clear />
      <a-input :style="{ width: '120px' }" placeholder="Please enter something" allow-clear />
      <a-input :style="{ width: '220px' }" placeholder="Please enter something" allow-clear>
        <template #append> 元/小时 </template>
      </a-input>
    </a-space>
  </div>
</template>
<style lang="less" scoped>
.Item {
  margin-bottom: 10px;
}
</style>

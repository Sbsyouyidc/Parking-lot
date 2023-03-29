<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'

const form = reactive({
  input: ''
})
</script>

<template>
  <div class="fee-details">
    <a-input-search
      :style="{ width: '220px' }"
      button-text="搜索"
      search-button
      placeholder="查询条件"
      v-model:model-value="form.input"
    />
  </div>
</template>
<style lang="less" scoped></style>

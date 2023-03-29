<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import resDetail from './resDetail.vue'
const store = useParkInfoStore()
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
      @search="store.search(form.input)"
      v-model:model-value="form.input"
    />
    <resDetail :obj="store.ChargeDetails" v-if="store.ChargeDetails.Price" />
  </div>
</template>
<style lang="less" scoped></style>

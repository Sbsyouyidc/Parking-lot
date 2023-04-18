<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import parkingTable from './parkingTable.vue'
import { useParkInfoStore } from '@/stores/parkInfo'
const store = useParkInfoStore()

const options = [
  { value: 'number', label: '编号' },
  { value: 'ParkingPlate', label: '车牌' }
]

const form = reactive({
  select: '',
  input: ''
})
</script>

<template>
  <div class="parking-inquiry">
    <div style="margin-left: 10px">
      <a-select
        allow-clear
        :options="options"
        :style="{ width: '120px' }"
        v-model:model-value="form.select"
        default-value=""
        placeholder="查询类别"
      />
      <a-input-search
        :style="{ width: '220px' }"
        button-text="搜索"
        search-button
        placeholder="查询条件"
        @search="store.searchSpace(form.select, form.input)"
        v-model:model-value="form.input"
      />
    </div>

    <parking-table />
  </div>
</template>
<style lang="less" scoped>
.arco-input-search {
  margin-left: 5px;
}
:deep(.arco-select-view-single),
:deep(.arco-input-wrapper) {
  background: rgb(255, 255, 255);
}
</style>

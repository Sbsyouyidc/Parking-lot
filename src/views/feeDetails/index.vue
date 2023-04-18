<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, watchEffect, computed } from 'vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import resDetail from './resDetail.vue'
import { useRoute } from 'vue-router'

const store = useParkInfoStore()
const route = useRoute()
const form = reactive({
  input: ''
})
const id = ref('')
watchEffect(() => {
  const routeId = route.query.id as string
  if (routeId && id.value !== routeId) {
    id.value = routeId
    store.search(routeId)
  }
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
    <resDetail :obj="store.ChargeDetails" v-if="store.ChargeDetails.Price" :id="id" />
  </div>
</template>
<style lang="less" scoped>
.arco-input-search {
  margin-bottom: 20px;
}
.arco-input-search {
  margin-left: 5px;
}
:deep(.arco-input-wrapper) {
  background: rgb(255, 255, 255);
}
</style>

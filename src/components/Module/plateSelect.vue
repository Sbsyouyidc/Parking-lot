<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import fetch from '@/request/fetch'

const options = ref<any[]>([])
const props = defineProps<{
  input?: string
}>()
const initStore = () => {
  return fetch.get('/api/getAllUser').then((res: any) => {
    options.value = res.filter((item: { type: string }) => item.type == '普通用户')
  })
}

initStore()
const emit = defineEmits<{ (e: 'on-change', val: string): void }>()
const change = (value: string) => {
  emit('on-change', value)
}
</script>

<template>
  <div class="plateSelect">
    <a-select
      placeholder="Please select ..."
      allow-search
      @change="change"
      v-model:model-value="props.input"
    >
      <a-option v-for="(item, index) in options" :key="index">{{ item.LicensePlate }}</a-option>
    </a-select>
  </div>
</template>
<style lang="less" scoped></style>

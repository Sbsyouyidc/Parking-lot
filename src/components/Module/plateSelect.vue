<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue'
import fetch from '@/request/fetch'

const options = ref<any[]>([])
const props = withDefaults(
  defineProps<{
    input?: string
  }>(),
  {}
)

const initStore = () => {
  return fetch.get('/api/getAllUser').then((res: any) => {
    const defa = localStorage.getItem('plate') as string
    if (defa) {
      options.value = res.filter((item: { LicensePlate: string }) => item.LicensePlate == defa)
    } else {
      options.value = res.filter((item: { type: string }) => item.type == '普通用户')
      console.log(options.value)
    }
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

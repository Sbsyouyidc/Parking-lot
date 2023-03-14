<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { IconPlus, IconMinus } from '@arco-design/web-vue/es/icon'

const props = withDefaults(defineProps<{ id: string; type: string }>(), {})

const emit = defineEmits<{ (e: 'on-delete', id: string, type: string): void }>()

const click = () => {
  emit('on-delete', props.id, props.type)
}
</script>

<template>
  <div class="Item">
    <a-space>
      <a-input :style="{ width: '220px' }" placeholder="Please enter something" allow-clear>
        <template #append> 小时 </template> </a-input
      >-
      <a-input :style="{ width: '220px' }" placeholder="Please enter something" allow-clear>
        <template #append> 小时 </template>
      </a-input>
      <a-input :style="{ width: '220px' }" placeholder="Please enter something" allow-clear>
        <template #append> 元/小时 </template>
      </a-input>
      <a-button @click="click"><IconMinus /></a-button>
    </a-space>
  </div>
</template>
<style lang="less" scoped>
.Item {
  margin-bottom: 10px;
}
</style>

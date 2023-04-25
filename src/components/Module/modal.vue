<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, watch, toRaw, toRefs } from 'vue'

const props = defineProps<{
  visible: boolean
}>()
const { visible } = toRefs(props)
const emit = defineEmits<{ (e: 'update:visible', val: boolean): void }>()
const handleOk = () => {
  emit('update:visible', false)
}
const handleCancel = () => {
  emit('update:visible', false)
}
</script>

<template>
  <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" simple width="auto">
    <template #title> 提示 </template>
    <div>
      <slot></slot>
    </div>
  </a-modal>
</template>
<style lang="less" scoped></style>

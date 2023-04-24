<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, watch, toRaw } from 'vue'

const props = defineProps<{
  visible: boolean
}>()

const visible = ref(false)

const handleOk = () => {
  visible.value = false
}
const handleCancel = () => {
  visible.value = false
}
watch(
  () => props.visible,
  () => {
    visible.value = !visible.value
  }
)
</script>

<template>
  <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" simple>
    <template #title> 警告 </template>
    <div>
      <slot></slot>
    </div>
  </a-modal>
</template>
<style lang="less" scoped></style>

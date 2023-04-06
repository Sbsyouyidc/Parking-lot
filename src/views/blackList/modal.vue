<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
type Props = {
  visible_f: boolean
}
const props = defineProps<Props>()
const visible = ref(false)

const handleClick = () => {
  visible.value = true
}
const handleOk = () => {
  visible.value = false
}
const handleCancel = () => {
  visible.value = false
}

watch(
  () => props.visible_f,
  (val) => {
    handleClick()
  }
)
</script>

<template>
  <div class="modal">
    <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
      <template #title> 违规行为登记 </template>
      <a-form>
        <a-form-item label="车牌">
          <a-select></a-select>
        </a-form-item>
        <a-form-item label="违规行为">
          <a-textarea :auto-size="{ minRows: 4 }"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<style lang="less" scoped></style>

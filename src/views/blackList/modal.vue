<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useBlackStore } from '@/stores/black'
import type { ValidatedError } from '@arco-design/web-vue/es/form'

const store = useBlackStore()
type Props = {
  visible_f: boolean
}
const props = defineProps<Props>()
const visible = ref(false)

const handleClick = () => {
  visible.value = true
}

const emit = defineEmits<{
  (e: 'optionItem', val: object): void
}>()
const handleOk = () => {
  emit('optionItem', store.form)
}

const handleCancel = () => {
  visible.value = false
  store.form.licenseplate = ''
  store.form.Irregularities = ''
  store.$patch((state) => {
    delete state.form.id
  })
}
const before = () => {
  return new Promise<void>((resolve, reject) => {
    formRef.value.validate((errors: undefined | Record<string, ValidatedError>) => {
      if (errors) {
        reject()
      } else {
        resolve()
      }
    })
  })
}

const rules = {
  licenseplate: [{ required: true, message: '不能为空' }],
  Irregularities: [{ required: true, message: '不能为空' }]
}
const formRef = ref()
watch(
  () => props.visible_f,
  (val) => {
    handleClick()
  }
)

function onSelect(dateString, date) {
  console.log('onSelect', dateString, date)
}

function onChange(dateString, date) {
  console.log('onChange: ', dateString, date)
}

function onOk(dateString, date) {
  console.log('onOk: ', dateString, date)
}
</script>

<template>
  <div class="modal">
    <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" :on-before-ok="before">
      <template #title> 违规行为登记 </template>
      <a-form :model="store.form" :rules="rules" ref="formRef">
        <a-form-item label="车牌" field="licenseplate">
          <a-input v-model="store.form.licenseplate"></a-input>
        </a-form-item>
        <a-form-item label="违规行为" field="Irregularities">
          <a-textarea v-model="store.form.Irregularities" :auto-size="{ minRows: 4 }"></a-textarea>
        </a-form-item>
        <a-form-item label="违规行为" field="Irregularities">
          <a-date-picker
            style="width: 220px; margin: 0 24px 24px 0"
            show-time
            :time-picker-props="{ defaultValue: '09:09:06' }"
            format="YYYY-MM-DD HH:mm:ss"
            @change="onChange"
            @select="onSelect"
            @ok="onOk"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<style lang="less" scoped></style>

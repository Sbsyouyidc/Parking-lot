<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { FieldRule, ValidatedError } from '@arco-design/web-vue'
import { ref, reactive, computed, defineEmits, watch, onMounted, nextTick } from 'vue'
const form = reactive<{ [key: string]: any }>({
  plate: {
    num1: '',
    num2: '',
    num3: '',
    num4: '',
    num5: '',
    num6: '',
    num7: ''
  }
})

const isValidator = ref(false)
let isEnd = true

const licensePlate = computed(() => {
  return Object.values(form.plate).join('')
})

const emit = defineEmits<{
  (e: 'update:licensePlate', name: String): void
  (e: 'update:plateValidator', name: boolean): void
}>()

watch(licensePlate, (val: string) => {
  emit('update:licensePlate', val)
  setTimeout(() => emit('update:plateValidator', isValidator.value), 800)
})

const inputItems = ref()

onMounted(() => {
  inputItems.value = document.querySelectorAll('.arco-input-size-medium')
})

document.onkeyup = function (e) {
  const items = Object.values(form.plate)
  const index = items.findIndex((item: string) => item == '')
  nextTick(() => {
    if (e.code == 'Backspace') {
      const empty = items.reduce((previousValue: number, currentValue: string) => {
        if (!currentValue) {
          previousValue++
        }
        return previousValue
      }, 0)

      if (empty == 1 && isEnd) {
        isEnd = false
        form.plate[`num${index + 1}`] = ''
      } else {
        inputItems.value[index - 1].focus()
        form.plate[`num${index}`] = ''
      }
    }
    if (e.code !== 'Backspace') {
      index == -1 ? (isEnd = true) : inputItems.value[index].focus()
    }
  })
}

const rules = {
  plate: {
    validator: (value: string, cb: (arg0: string) => void) => {
      return new Promise((resolve) => {
        const isLegal =
          /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(
            licensePlate.value
          )

        if (licensePlate.value.length == 7 && !isLegal) {
          isValidator.value = false
          cb('请输入正确车牌号')
        }
        if (isLegal) {
          console.log(licensePlate.value)
          isValidator.value = true
        } else {
          isValidator.value = false
        }
        resolve()
      })
    }
  }
}
const ad = ref()
</script>

<template>
  <a-form :model="form" layout="vertical" size="medium" class="plate-form" :rules="rules" ref="ad">
    <a-form-item field="plate" label="车牌号" >
      <a-space size="small">
        <a-input max-length="1" v-model="form.plate.num1" />
        <a-input max-length="1" v-model="form.plate.num2" />
        <a-input max-length="1" v-model="form.plate.num3" />
        <a-input max-length="1" v-model="form.plate.num4" />
        <a-input max-length="1" v-model="form.plate.num5" />
        <a-input max-length="1" v-model="form.plate.num6" />
        <a-input max-length="1" v-model="form.plate.num7" />
      </a-space>
    </a-form-item>
  </a-form>
</template>
<style lang="less" scoped>
.arco-input-wrapper :deep(.arco-input.arco-input-size-medium) {
  text-align: center;
  font-size: 15px;
}
</style>

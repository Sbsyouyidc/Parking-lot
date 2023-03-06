<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, computed, toRaw } from 'vue'
import fetch from '@/request/fetch'
import type { FileItem } from '@arco-design/web-vue/es/upload'
import { Message } from '@arco-design/web-vue'
const form = reactive({
  num1: '',
  num2: '',
  num3: '',
  num4: '',
  num5: '',
  num6: '',
  num7: ''
})

const I1 = ref()
const I2 = ref()
const I3 = ref()
const I4 = ref()
const I5 = ref()
const I6 = ref()
const imagePath = ref('')
const isDisable = computed(() => {
  if (licensePlate.value.length == 7 && imagePath.value !== '') {
    return false
  } else {
    return true
  }
})

const successLoad = (fileItem: FileItem) => {
  const {
    response: { path }
  } = fileItem
  imagePath.value = path
}

const licensePlate = computed(() => {
  return Object.values(form).join('')
})
const recognition = () => {
  const params = {
    licensePlate: licensePlate.value,
    imagePath: imagePath.value
  }
  fetch.post('/api/recognition', params).then((result: any) => {
    const { res } = result
    ;(res && Message.success('注册失败')) || Message.normal('注册成功')
  })
}
</script>

<template>
  <div class="Login box-shadow">
    <div class="Login-title">
      <a-typography-title :heading="3">注册</a-typography-title>
    </div>
    <a-col :span="13">
      <a-alert>This is an info alert.</a-alert>
    </a-col>
    <div class="Login-body">
      <a-form :model="form" layout="vertical" size="medium">
        <a-form-item field="name" label="车牌号">
          <a-space size="small">
            <a-input max-length="1" ref="I1" v-model="form.num1" />
            <a-input max-length="1" ref="I2" v-model="form.num2" />
            <a-input max-length="1" ref="I3" v-model="form.num3" />
            <a-input max-length="1" ref="I4" v-model="form.num4" />
            <a-input max-length="1" ref="I5" v-model="form.num5" /><a-input
              max-length="1"
              ref="I6"
              v-model="form.num6" /><a-input max-length="1" ref="I5" v-model="form.num7"
          /></a-space>
        </a-form-item>
      </a-form>
      <div class="divider">
        <div class="divider-body"></div>
      </div>
      <div class="upload-body">
        <a-upload
          action="/api/upload"
          :limit="1"
          list-type="picture"
          @success="successLoad"
          :on-before-remove="
            () => {
              imagePath = ''
              return true
            }
          "
        />
      </div>
    </div>
    <a-button @click="recognition" :disabled="isDisable">车牌绑定</a-button>
  </div>
</template>
<style lang="less" scoped>
.Login {
  background-color: #ffffff;
  position: absolute;
  left: 50%;
  top: 50%;
  padding: 20px;
  transform: translate(-50%, -50%);
}

.Login-body {
  padding: 10px;
  width: 100%;
  display: flex;

  & > .arco-form {
    width: calc(50%);
  }

  & > .upload-body {
    width: calc(50%);
    text-align: center;

    & .arco-upload-list-item {
      justify-content: center;
    }
  }
}

.arco-input-wrapper :deep(.arco-input.arco-input-size-medium) {
  text-align: center;
  font-size: 15px;
}

.divider {
  border-left: 1px solid var(--color-neutral-3);
  height: 100px;
  margin: 0 12px;
}

:deep(.arco-image-footer) {
  justify-content: end;
}

.action {
  padding: 5px 4px;
  font-size: 14px;
  border-radius: 2px;
  line-height: 1;
  cursor: pointer;

  &:hover {
    color: #ffffff;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>

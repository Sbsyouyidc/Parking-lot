<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, watch, toRaw } from 'vue'
import type { FileItem, ValidatedError } from '@arco-design/web-vue'
import { useUserManage } from '@/stores/userManage'
import { storeToRefs } from 'pinia'
const store = useUserManage()
const { visible, form } = storeToRefs(store)

const handleClick = () => {
  store.options()
}

const handleChange = () => {
  store.visible = !visible.value
  store.type = 'add'
  store.form = {
    username: '',
    password: '',
    type: '',
    image: ''
  }
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
const successLoad = (fileItem: FileItem) => {
  const {
    response: { path }
  } = fileItem

  form.value.image = path
}
const imagePath = ref('')

const formRef = ref()
const selectOptions = reactive([
  {
    label: '普通用户'
  },
  {
    label: '管理员'
  }
])

const rules: { password: any[]; type: any[]; username: any[]; image?: any[] } = {
  username: [
    { required: true, message: 'name is required' },
    { minLength: 5, message: 'must be greater than 5 characters' }
  ],
  type: [{ required: true, message: 'name is required' }],
  password: [
    { required: true, message: 'name is required' },
    { minLength: 5, message: 'must be greater than 5 characters' }
  ],
  image: [{ required: true, message: 'name is required' }]
}
</script>

<template>
  <a-button type="primary" @click="handleChange">新增用户</a-button>
  <div class="modalForm">
    <a-modal
      v-model:visible="visible"
      @ok="handleClick"
      :on-before-ok="before"
      @cancel="handleChange"
    >
      <template #title> Title </template>
      <a-form :model="form" ref="formRef" :rules="rules">
        <a-form-item field="username" label="用户名">
          <a-input v-model="form.username" />
        </a-form-item>
        <a-form-item field="password" label="密码">
          <a-input-password
            placeholder="Please enter something"
            allow-clear
            v-model="form.password"
          />
        </a-form-item>
        <a-form-item field="type" label="用户类型">
          <a-select v-model="form.type">
            <a-option
              v-for="(item, index) of selectOptions"
              :value="item.label"
              :label="item.label"
              :key="index"
          /></a-select>
        </a-form-item>
        <a-form-item field="image" label="车牌图片" v-if="form.type === '普通用户'">
          <a-upload
            action="/api/upload"
            :limit="1"
            list-type="picture"
            @success="successLoad"
            :default-file-list="store.file"
            :on-before-remove="
              () => {
                imagePath = ''
                return true
              }
            "
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<style lang="less" scoped></style>

<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import plateForm from '@/components/Module/plateForm.vue'
import fetch from '@/request/fetch'
import { Message } from '@arco-design/web-vue'
const router = useRouter()
const licensePlate = ref('')
const plateValidator = ref(false)
const login = () => {
  const params = {
    licensePlate: licensePlate.value
  }
  fetch.post('/api/login', params).then((result: { res: any; message: any }) => {
    const { res, message } = result
    ;(res && Message.success(message)) || Message.info(message)
  })
}
</script>

<template>
  <div class="main box-shadow">
    <a-typography-title :heading="4">登录</a-typography-title>
    <div class="main-body">
      <plateForm v-model:licensePlate="licensePlate" v-model:plateValidator="plateValidator" />
    </div>
    <a-space>
      <a-button @click="router.push('/Register')">注册</a-button>
      <a-button type="primary" @click="login">登录</a-button>
    </a-space>
  </div>
</template>
<style lang="less" scoped>
.main {
  background-color: #ffffff;
  position: absolute;
  left: 50%;
  top: 50%;
  padding: 20px;
  transform: translate(-50%, -50%);
  :deep(.arco-page-header-wrapper) {
    padding-left: 0px;
  }
}
</style>

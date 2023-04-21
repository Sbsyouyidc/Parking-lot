<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import fetch from '@/request/fetch'
import { useUserMainStore } from '@/stores/userMain'
const store = useUserMainStore()
const router = useRouter()
onMounted(() => {
  localStorage.setItem('plate', '')
  localStorage.setItem('myState', '')
})
const login = () => {
  fetch.post('/api/login', form).then((result: { res: string; message: string; arr: any }) => {
    const { res, message, arr } = result
    if (res) {
      if (arr.LicensePlate) {
        localStorage.setItem('plate', arr.LicensePlate)
        localStorage.setItem('myState', JSON.stringify(arr))
        router.push('/userMain')
      } else {
        router.push('/Home')

        localStorage.setItem('plate', '')
        localStorage.setItem('myState', '')
      }
      Message.success(message)
    } else {
      Message.info(message)
    }
  })
}
const form = reactive({
  username: '',
  password: ''
})
</script>

<template>
  <div class="main box-shadow">
    <a-typography-title :heading="4">登录</a-typography-title>
    <div class="main-body">
      <a-form :model="form" :style="{ width: '300px' }">
        <a-form-item field="username" label="用户名">
          <a-input v-model="form.username" />
        </a-form-item>
        <a-form-item field="password" label="密码">
          <a-input v-model="form.password" />
        </a-form-item>
      </a-form>
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

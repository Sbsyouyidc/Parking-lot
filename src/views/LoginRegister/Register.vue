<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FileItem } from '@arco-design/web-vue/es/upload'
import { Message } from '@arco-design/web-vue'
import fetch from '@/request/fetch'
const router = useRouter()
const imagePath = ref('')

const successLoad = (fileItem: FileItem) => {
  const {
    response: { path }
  } = fileItem
  imagePath.value = path
}

const recognition = () => {
  const params = {
    username: '',
    password: '',
    imagePath: imagePath.value
  }
  fetch.post('/api/recognition', params).then((result: any) => {
    const { res, message } = result
    ;(res && Message.success(message)) || Message.normal(message)
  })
}
const form = reactive({
  username: '',
  password: ''
})
</script>

<template>
  <div class="main box-shadow">
    <a-page-header title="注册" @back="() => router.replace({ name: 'Login' })"></a-page-header>

    <div class="main-body">
      <a-form :model="form" layout="vertical" :style="{ width: '300px' }">
        <a-form-item field="username" label="用户名">
          <a-input v-model="form.username" />
        </a-form-item>
        <a-form-item field="password" label="密码">
          <a-input v-model="form.password" />
        </a-form-item>
        <a-form-item label="车牌上传">
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
        </a-form-item>
      </a-form>
    </div>
    <a-button @click="recognition">注册</a-button>
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

.main-body {
  padding: 10px;
  width: 100%;
  display: flex;

  & > .plate {
    width: calc(50%);
  }

  & > .upload {
    flex: 1;
    text-align: center;

    & .arco-upload-list-item {
      justify-content: center;
    }
  }
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

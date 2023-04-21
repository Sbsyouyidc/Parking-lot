<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserMainStore } from '@/stores/userMain'
import { useBlackStore } from '@/stores/black'
import { storeToRefs } from 'pinia'
import { IconEdit, IconSave } from '@arco-design/web-vue/es/icon'
import dayjs from 'dayjs'

import checkGroup from './checkGroup.vue'
import upload from './upload.vue'
const store = useUserMainStore()
const blackStore = useBlackStore()
const router = useRouter()
const { mySate } = storeToRefs(store)
onMounted(() => {
  const plate = localStorage.getItem('plate') as string
  blackStore.blackArray(plate)
})
const data = ref([
  {
    label: '用户名',
    value: mySate.value.username
  },
  {
    label: '密码',
    value: mySate.value.password
  }
])

const logout = () => {
  router.push({ name: 'Login' })
}

const edit = ref(false)
const click = () => {
  edit.value = !edit.value
}

const save = () => {
  const params = {
    info: {
      username: data.value[0].value,
      password: data.value[1].value
    },
    Id: mySate.value.Id
  }
  console.log(params)
}
</script>

<template>
  <div class="my-main">
    <a-typography-title :heading="6">
      待处理违规记录
      <a-space style="float: right">
        <a-button type="primary" size="mini" @click="save" v-if="edit">
          <template #icon> <icon-save /> </template
        ></a-button>
        <a-button size="mini">
          <template #icon> <icon-edit @click="click" /> </template
        ></a-button>
      </a-space>
    </a-typography-title>
    <a-list>
      <a-list-item>
        <span>车牌 </span>
        <upload v-if="edit" class="right" />
        <a-image
          v-else
          class="right"
          width="100"
          :src="`http://localhost:3000/static/images/${mySate.image}`"
        ></a-image>
      </a-list-item>
      <a-list-item v-for="item in data" :key="item">
        <div style="text-align: right">
          <span style="float: left">{{ item.label }}</span>
          <a-input v-model:model-value="item.value" v-if="edit" />
          <div class="right" v-else>{{ item.value }}</div>
        </div>
      </a-list-item>
    </a-list>
    <checkGroup />
    <a-divider />
    <a-list>
      <template #header> 历史违规记录 </template>
      <a-list-item v-for="idx in blackStore.UntreatedBlack" :key="idx">
        <template #meta>
          <div class="item">
            <div>违规编号</div>
            <div>{{ idx.id }}</div>
          </div>
          <div class="item">
            <div>违规情况</div>
            <div>{{ idx.Irregularities }}</div>
          </div>
          <div class="item">
            <div>处理状态</div>
            <div>{{ blackStore.status[idx.status].label }}</div>
          </div>
          <span class="date">{{ dayjs(idx.dateTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </a-list-item>
    </a-list>
    <div style="width: 100%; padding: 20px">
      <a-button type="primary" style="width: 100%" @click="logout">退出</a-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
.my-main {
  margin: 10px 15px 10px 15px;
}
.arco-list-wrapper {
  background-color: #ffffffe6;
}
.right {
  float: right;
}
:deep(.arco-input-wrapper) {
  width: auto;
}

.custom-checkbox-card-checked .custom-checkbox-card-mask-dot {
  background-color: rgb(var(--primary-6));
}
.item {
  display: flex;
  justify-content: space-between;

  & div:nth-child(1) {
    color: var(--color-neutral-6);
  }
  & ~ & {
    margin-top: 5px;
  }
}
.date {
  float: right;
}
</style>

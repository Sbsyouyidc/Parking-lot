<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserMainStore } from '@/stores/userMain'
import { useBlackStore } from '@/stores/black'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import checkGroup from './checkGroup.vue'

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
  },
  {
    label: '车牌',
    value: mySate.value.LicensePlate
  }
])

const logout = () => {
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="my-main">
    <a-typography-title :heading="6"> 个人信息 </a-typography-title>
    <a-list>
      <a-list-item>
        <span>车牌 </span>
        <a-image
          class="right"
          width="100"
          :src="`http://localhost:3000/static/images/${mySate.image}`"
        ></a-image>
      </a-list-item>
      <a-list-item v-for="item in data" :key="item">
        <span>{{ item.label }}</span>
        <span class="right">{{ item.value }}</span>
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

<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onActivated } from 'vue'
import { useUserMainStore } from '@/stores/userMain'
import { useBlackStore } from '@/stores/black'
import { storeToRefs } from 'pinia'

const store = useUserMainStore()
const blackStore = useBlackStore()

const { mySate } = storeToRefs(store)
onActivated(() => {
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
    <a-divider />
    <a-list>
      <template #header> 违规记录 </template>
      <a-list-item v-for="idx in blackStore.plateBlack" :key="idx">
        <template #meta>
          <div>
            <div>违规记录号</div>
            <div>{{ idx.Irregularities }}</div>
          </div>
          <div>
            <div>处理状态</div>
            <div>{{ blackStore.status[idx.status].label }}</div>
          </div>
          <div>违规时间{{ idx.dateTime }}</div>
        </template>
      </a-list-item>
    </a-list>
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
</style>

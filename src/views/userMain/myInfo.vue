<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserMainStore } from '@/stores/userMain'
import { storeToRefs } from 'pinia'

const store = useUserMainStore()

const { mySate } = storeToRefs(store)

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
  </div>
</template>
<style lang="less" scoped>
.my-main {
  margin: 30px 15px 0 15px;
  height: 100%;
}
.arco-list-wrapper {
  border-radius: 10px;
  background-color: #ffffffe6;
}
.right {
  float: right;
}
</style>

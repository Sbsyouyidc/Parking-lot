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
    <a-image width="100" :src="`http://localhost:3000/static/images/${mySate.image}`"></a-image>
    <a-descriptions style="margin-top: 20px" :data="data" :column="1"> </a-descriptions
    ><a-button type="primary">编辑</a-button>
  </div>
</template>
<style lang="less" scoped>
.my-main {
  margin-top: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

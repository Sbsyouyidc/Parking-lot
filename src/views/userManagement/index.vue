<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

import { useUserManage } from '@/stores/userManage'
import userTable from './userTable.vue'
import modalForm from './modalForm.vue'
const store = useUserManage()
onMounted(() => {
  store.initStore()
})
</script>

<template>
  <div class="user-management">
    <modalForm />
    <user-table />
  </div>
</template>
<style lang="less" scoped></style>

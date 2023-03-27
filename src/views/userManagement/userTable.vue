<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { IconEdit, IconDelete } from '@arco-design/web-vue/es/icon'
import { useUserManage } from '@/stores/userManage'
const store = useUserManage()
</script>

<template>
  <div class="user-table">
    <a-table :data="store.data" bordered pagination="{ pageSize: 14 }">
      <template #columns>
        <a-table-column title="Id" data-index="Id"></a-table-column>
        <a-table-column title="用户类型" data-index="type"></a-table-column>
        <a-table-column title="用户名" data-index="userName"></a-table-column>
        <a-table-column title="密码" data-index="passWord"></a-table-column>
        <a-table-column title="车牌" data-index="LicensePlate"></a-table-column>
        <a-table-column title="车牌图片" data-index="image"
          ><template #cell="{ record }">
            <a-image
              width="50"
              height="50"
              :src="`http://localhost:3000/static/images/${record.image}`"
            /> </template
        ></a-table-column>

        <a-table-column title="操作" fixed="right" width="120">
          <template #cell="{ record }">
            <a-space size="medium">
              <icon-edit /><icon-delete @click="store.deleteUser(record.Id)"
            /></a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>
<style lang="less" scoped>
.user-table {
  margin: 5px;
}
</style>

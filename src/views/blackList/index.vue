<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import dayjs from 'dayjs'
import { IconEdit, IconDelete } from '@arco-design/web-vue/es/icon'
import { useBlackStore } from '@/stores/black'
import modal from './modal.vue'
import process from './process.vue'
const store = useBlackStore()
onMounted(() => {
  store.initStore()
})

const visible = ref(false)
const type = ref('')
const optionItem = (form: object) => {
  if (type.value == 'add') {
    store.postItem(form)
  } else {
    store.putItem(form)
  }
}
const showEdit = (record: object) => {
  type.value = 'edit'
  store.form = record
  visible.value = !visible.value
}

const add = () => {
  ;(visible.value = !visible.value), (type.value = 'add')
}
</script>

<template>
  <modal :visible_f="visible" @optionItem="optionItem" /> <a-button @click="add">新增</a-button>
  <div class="show">
    <!-- <process /> -->
    <div class="black-list">
      <a-table :data="store.state" :pagination="{ pageSize: 15 }">
        <template #columns>
          <a-table-column title="id" data-index="id"></a-table-column>
          <a-table-column title="车牌" data-index="licenseplate"></a-table-column>
          <a-table-column title="违规行为" data-index="Irregularities"></a-table-column>
          <a-table-column title="违规时间" data-index="dateTime">
            <template #cell="{ record }">
              {{ dayjs(record.dateTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template></a-table-column
          >
          <a-table-column title="处理状态">
            <template #cell="{ record }">
              <a-tag :color="store.status[record.status].color">
                {{ store.status[record.status].label }}</a-tag
              >
            </template>
          </a-table-column>
          <a-table-column title="操作" fixed="right" width="150">
            <template #cell="{ record }">
              <a-space size="medium">
                <icon-edit @click="showEdit({ ...record })" /><icon-delete
                  @click="store.deletedItem(record.id)"
              /></a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
</template>
<style lang="less" scoped>
.show {
  display: flex;
  height: 100%;
  margin-top: 10px;
  .black-list {
    flex: 1;
  }
}
</style>

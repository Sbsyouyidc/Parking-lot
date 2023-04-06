<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { IconEdit, IconDelete } from '@arco-design/web-vue/es/icon'
import { useBlackStore } from '@/stores/black'
import modal from './modal.vue'
const store = useBlackStore()
onMounted(() => {
  store.initStore()
})

const visible = ref(false)
</script>

<template>
  <a-button @click="visible = !visible">新增</a-button>
  <modal :visible_f="visible" />
  <div class="black-list">
    <a-table :data="store.state" style="margin-top: 30px">
      <template #columns>
        <a-table-column title="id" data-index="id"></a-table-column>
        <a-table-column title="车牌" data-index="licenseplate"></a-table-column>
        <a-table-column title="违规行为" data-index="Irregularities"></a-table-column>
        <a-table-column title="操作" fixed="right" width="150">
          <template #cell="{ record }">
            <a-space size="medium">
              <icon-edit @click="store.editItem()" /><icon-delete
                @click="store.deletedItem(record.id)"
            /></a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>
<style lang="less" scoped></style>

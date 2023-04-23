<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onActivated, onMounted } from 'vue'
import { useMessageStore } from '@/stores/message'
import { IconInfoCircle, IconDelete } from '@arco-design/web-vue/es/icon'

const store = useMessageStore()
onActivated(() => {
  store.init()
})
const items: { [key: string]: string } = {
  abnormal: '时间异常',
  Appointment: '预定'
}
</script>

<template>
  <div class="message">
    <div class="list" v-for="item in Object.keys(store.state)" :key="item">
      <a-typography-title :heading="6"> {{ items[item] }} </a-typography-title>
      <a-list>
        <a-list-item v-for="idx in store[item]" :key="idx">
          <a-space>
            <icon-info-circle size="20" />
            <div>
              <a-list-item-meta :description="idx.text"> </a-list-item-meta>
              <div class="date">{{ idx.time }}</div>
            </div>
          </a-space>

          <template #actions>
            <icon-delete @click="store.deleteMessage(idx.id)" />
          </template>
        </a-list-item>
      </a-list>
    </div>
    <!-- <div class="user-reservation list">
      <a-typography-title :heading="6"> 用户预定 </a-typography-title>
      <a-list>
        <a-list-item v-for="idx in store.Appointment" :key="idx">
          <a-space>
            <icon-info-circle size="20" />
            <a-list-item-meta :description="idx.text"> </a-list-item-meta
          ></a-space>

          <template #actions>
            <icon-delete />
          </template>
        </a-list-item>
      </a-list>
    </div> -->
  </div>
</template>
<style lang="less" scoped>
.message {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.date {
  color: var(--color-neutral-6);
}
.list {
  font-weight: bold;
  border-radius: 10px;
  flex-basis: 500px;
  :deep(.arco-list-wrapper) {
    background-color: white;
    .arco-list-content {
      max-height: 700px;
      overflow-y: auto;
    }
  }
}
</style>

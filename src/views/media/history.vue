<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useHistoryStore } from './history'
const store = useHistoryStore()
onMounted(() => {
  store.init()
})
const isReverse = ref(true)

const onChange = (bool: boolean) => {
  isReverse.value = bool
}
</script>

<template>
  <div class="history">
    <div>
      <h3>历史记录</h3>
      <a-typography-text :style="{ verticalAlign: 'middle', marginRight: '8px' }">
        排序
      </a-typography-text>
      <a-radio-group @change="onChange" :modelValue="isReverse">
        <a-radio :value="false">正序</a-radio>
        <a-radio :value="true">倒序</a-radio>
      </a-radio-group>
    </div>
    <div class="body">
      <a-timeline :reverse="isReverse">
        <a-timeline-item v-for="(item, key) in store.state" :key="key" :label="item.time">
          <div>车牌{{ item.plate }}</div>
          <div :style="{ color: item.type == 'entry' ? 'green' : 'red' }">
            {{ item.type == 'entry' ? '进入' : '离场' }}
          </div>
          <a-image
            :src="`http://localhost:3000/static/images/${item.image}`"
            width="150"
            height="150"
          ></a-image
        ></a-timeline-item>
      </a-timeline>
    </div>
  </div>
</template>
<style lang="less" scoped>
.history {
  float: right;
}
.body {
  height: 700px;
  overflow-y: auto;
}
:deep(.arco-timeline-item-content-wrapper) {
  margin-bottom: 20px;
}
</style>

<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useHistoryStore } from './history'
const store = useHistoryStore()
onMounted(() => {
  store.init()
})
const isReverse = ref(false)

const onChange = (bool: boolean) => {
  isReverse.value = bool
}
</script>

<template>
  <div class="history">
    <div>
      <a-typography-text :style="{ verticalAlign: 'middle', marginRight: '8px' }">
        Reverse
      </a-typography-text>
      <a-radio-group @change="onChange" :modelValue="isReverse">
        <a-radio :value="false">No Reverse</a-radio>
        <a-radio :value="true">Reverse</a-radio>
      </a-radio-group>
    </div>
    <div class="body">
      <a-timeline :reverse="isReverse">
        <a-timeline-item v-for="(item, key) in store.state" :key="key" :label="item.time">
          <div>车牌{{ item.plate }}</div>
          <a-image
            :src="`http://localhost:3000/static/images/${item.entryImage}`"
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
  display: flex;
  flex-direction: column;
  height: 100%
}
.body {
  flex: 1;
  overflow-y: auto;
}
:deep(.arco-timeline-item-content-wrapper) {
  margin-bottom: 20px;
}
</style>

<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useManaGement } from '@/stores/management'
import { storeToRefs } from 'pinia'
const store = useManaGement()
type Props = {
  height: number
}

const { curItem } = storeToRefs(store)
const props = withDefaults(defineProps<Props>(), {})

const deleteItem = (id: number | undefined, index: number | undefined) => {
  if (id) {
    console.log(id)
    store.deleteItem(id)
  } else {
    console.log(index)
    store.$patch((state) => {
      state.data.newItem.splice(index as number, 1)
    })
  }
}
</script>

<template>
  <a-menu class="edit-card" mode="pop" :style="{ width: '220px', height: props.height + 'px' }">
    <div class="filed">
      坐标
      <a-space>
        <a-input-number v-model="curItem.coordinates.X">
          <template #prepend>X</template> </a-input-number
        ><a-input-number v-model="curItem.coordinates.Y">
          <template #prepend>Y</template>
        </a-input-number></a-space
      >
    </div>
    <div class="filed">
      旋转
      <a-input-number v-model="curItem.coordinates.degree">
        <template #append> ° </template>
      </a-input-number>
    </div>
    <div class="filed">编号 <a-input v-model="curItem.number"> </a-input></div>
    <div class="filed" v-if="curItem.status == 'true' || curItem.status == 'false'">
      启用状态
      <a-space>
        <a-switch v-model="curItem.status" checked-value="true" unchecked-value="false"> </a-switch
      ></a-space>
    </div>

    <div class="filed">
      收费类型
      <a-select v-model="curItem.type" placeholder="Please select ...">
        <a-option
          v-for="item of store.orderOptions"
          :key="item"
          :value="item.label"
          :label="item.label"
        />
      </a-select>
    </div>

    <a-button @click="deleteItem(curItem.id, curItem.index)">删除</a-button>
  </a-menu>
</template>
<style lang="less" scoped>
.filed {
  margin: 20px 0px 5px 0px;
  font-size: 15px;
  font-family: Inter, '-apple-system', BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB',
    'noto sans', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
</style>

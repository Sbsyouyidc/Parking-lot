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
const collapsed = reactive({
  default: true,
  change: true
})

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
  <a-menu
    class="edit-card"
    mode="pop"
    :default-collapsed="collapsed.default"
    v-model:collapsed="collapsed.change"
    :style="{ width: '200px', height: props.height + 'px' }"
    show-collapse-button
    breakpoint="xl"
  >
    <div class="filed">
      坐标
      <a-space>
        <a-input v-model="curItem.coordinates.X"> <template #prepend>X</template> </a-input
        ><a-input v-model="curItem.coordinates.Y">
          <template #prepend>Y</template>
        </a-input></a-space
      >
    </div>
    <div class="filed">编号 <a-input v-model="curItem.number"> </a-input></div>
    <div class="filed">
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

<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useManaGement } from '@/stores/management'
import { storeToRefs } from 'pinia'
type Props = {
  client: { x: number; y: number }
}

const store = useManaGement()
const { concatData, data } = storeToRefs(store)
const props = withDefaults(defineProps<Props>(), {})

const mouserDown = (event: MouseEvent, index: number) => {
  const { offsetX, offsetY } = event
  const type = concatData.value[index].id ? 'oldItem' : 'newItem'
  let indexOf = 0
  if (type == 'oldItem') {
    const id = concatData.value[index].id
    indexOf = data.value[type].findIndex((item) => item.id == id)
  } else {
    indexOf = concatData.value[index].index as number
  }

  store.curItem = data.value[type][indexOf]
  document.onmousemove = (payload: any) => {
    const { clientX, clientY } = payload
    const left = clientX - offsetX - props.client.x < 0 ? 0 : clientX - offsetX - props.client.x
    const top = clientY - offsetY - props.client.y < 0 ? 0 : clientY - offsetY - props.client.y
    store.$patch((state) => {
      state.data[type][indexOf].coordinates.X = left
      state.data[type][indexOf].coordinates.Y = top
      state.curItem = state.data[type][indexOf]
    })
  }

  document.onmouseup = () => {
    document.onmousemove = document.onmousedown = null
  }
}
</script>

<template>
  <div
    class="edit-item"
    v-for="(item, index) in concatData"
    :key="index"
    @mousedown="mouserDown($event, index)"
    :style="{
      left: concatData[index].coordinates.X + 'px',
      top: concatData[index].coordinates.Y + 'px'
    }"
    :class="[concatData[index].status == 'true' ? 'use' : 'unUse']"
  >
    {{ item.number }}
  </div>
</template>
<style lang="less" scoped>
.edit-item {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
  position: absolute;
  user-select: none;
  font-weight: bold;
}

.use {
  background-color: rgba(0, 0, 255, 0.2);
  border: 2px dashed #00f;
}
.unUse {
  background-color: rgba(82, 82, 82, 0.2);
  border: 2px dashed rgb(86, 86, 88);
}
</style>

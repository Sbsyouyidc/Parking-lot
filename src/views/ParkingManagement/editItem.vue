<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useManaGement } from '@/stores/management'

type Props = {
  client: { x: number; y: number }
}

const store = useManaGement()
const data = computed(() => store.data)
const props = withDefaults(defineProps<Props>(), {})

const mouserDown = (event: MouseEvent, index: number) => {
  const { offsetX, offsetY } = event
  store.curItem = data.value[index]
  document.onmousemove = (payload: any) => {
    const { clientX, clientY } = payload
    const left = clientX - offsetX - props.client.x < 0 ? 0 : clientX - offsetX - props.client.x
    const top = clientY - offsetY - props.client.y < 0 ? 0 : clientY - offsetY - props.client.y
    store.$patch((state) => {
      state.curItem = data.value[index]
      state.data[index].coordinates.X = left
      state.data[index].coordinates.Y = top
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
    v-for="(item, index) in data"
    :key="index"
    @mousedown="mouserDown($event, index)"
    :style="{ left: data[index].coordinates.X + 'px', top: data[index].coordinates.Y + 'px' }"
    :class="[data[index].status == 'true' ? 'use' : 'unUse']"
  >
    {{ item.number }}
  </div>
</template>
<style lang="less" scoped>
.edit-item {
  cursor: pointer;
  text-align: center;
  line-height: 40px;
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

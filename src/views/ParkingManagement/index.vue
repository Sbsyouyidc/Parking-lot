<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import editCard from './editCard.vue'
import editItem from './editItem.vue'
import { useManaGement } from '@/stores/management'
import { storeToRefs } from 'pinia'
let offset = {
  x: 0,
  y: 0
}
const store = useManaGement()

const { data } = storeToRefs(store)
const client = reactive({
  x: 0,
  y: 0,
  height: 0
})
onMounted(async () => {
  await store.initStore()
  nextTick(() => {
    const ctx = document.querySelector('#tutorial') as HTMLCanvasElement
    const { left, top, height } = ctx.getBoundingClientRect()
    client.x = left
    client.y = top
    client.height = height
  })
})

const dragStart = (e: any) => {
  offset.x = e.layerX
  offset.y = e.layerY
}

const drop = (e: { clientX: any; clientY: any }) => {
  const id = data.value.length
  store.$patch((state) => {
    state.data.push({
      EndParkingTime: '',
      ParkingPlate: '',
      StartParkingTime: '',
      coordinates: { X: 0, Y: 0 },
      creationTime: '',
      id: id + 1,
      number: '',
      status: 'true',
      type: ''
    })
  })

  const { clientX, clientY } = e
  const left = clientX - client.x - offset.x
  const top = clientY - client.y - offset.y
  store.$patch((state) => {
    state.data[id].coordinates.X = left
    state.data[id].coordinates.Y = top
  })
}

const dragOver = (e: DragEvent) => {
  e.preventDefault()
}
</script>

<template>
  <div class="parking-management">
    <a-button type="primary" @click="store.save">保存</a-button>
    <main>
      <div class="card box-shadow" draggable="true" @dragstart="dragStart">车位</div>
      <div id="tutorial" @drop="drop" @dragover="dragOver">
        <edit-item :client="client" />
      </div>
      <editCard :height="client.height" />
    </main>
  </div>
</template>
<style lang="less" scoped>
main {
  margin-top: 10px;
  display: flex;
}
#tutorial {
  flex: 1;
  margin: 0px 10px 0 10px;
  height: 600px;
  position: relative;
  background-color: rgb(240, 238, 238);
  overflow: auto;
}
.card {
  width: 90px;
  height: 30px;
  text-align: center;
}

.arco-collapse {
  border: none;
}
</style>

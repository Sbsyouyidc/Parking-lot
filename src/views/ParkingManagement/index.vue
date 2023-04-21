<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onActivated } from 'vue'
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
const basie = ref('')
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

const dragStart = (e: any, type1: string = '') => {
  basie.value = type1
  offset.x = e.layerX
  offset.y = e.layerY
}

const drop = (e: { clientX: any; clientY: any }) => {
  const index = data.value.newItem.length
  const type = basie.value
  store.$patch((state) => {
    state.data.newItem.push({
      EndParkingTime: '',
      ParkingPlate: '',
      StartParkingTime: '',
      coordinates: { X: 0, Y: 0, degree: 0 },
      creationTime: '',
      number: '',
      status: 'true',
      type,
      index
    })
  })

  const { clientX, clientY } = e
  const left = clientX - client.x - offset.x
  const top = clientY - client.y - offset.y
  store.$patch((state) => {
    state.data.newItem[index].coordinates.X = left
    state.data.newItem[index].coordinates.Y = top
  })
}

const dragOver = (e: DragEvent) => {
  e.preventDefault()
}

const save = () => {
  store.save().then(() => {
    store.initStore()
  })
}
</script>

<template>
  <div class="parking-management">
    <a-button type="primary" @click="save">保存</a-button>
    <main>
      <div>
        <div class="card box-shadow" draggable="true" @dragstart="dragStart($event)">车位</div>
        <div class="card box-shadow" draggable="true" @dragstart="dragStart($event, 'static')">
          出口
        </div>
      </div>

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
  margin-bottom: 15px;
  text-align: center;
}

.arco-collapse {
  border: none;
}
</style>

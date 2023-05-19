<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onDeactivated } from 'vue'
import editCard from './editCard.vue'
import editItem from './editItem.vue'
import { useManaGement } from '@/stores/management'
import { storeToRefs } from 'pinia'
import cardCube from '@/components/Module/cardCube.vue'
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
    client.height = height + 45
  })
})

window.onresize = () => {
  nextTick(() => {
    const ctx = document.querySelector('#tutorial') as HTMLCanvasElement
    const { left, top, height } = ctx.getBoundingClientRect()
    client.x = left
    client.y = top
    client.height = height + 45
  })
}
onDeactivated(() => {
  window.onresize = null
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
      number: '',
      status: 'true',
      type,
      index,
      floor: store.floor
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

const onChange = (val: number) => {
  store.switchFloor(val)
}
</script>

<template>
  <a-button type="primary" @click="save">保存</a-button>
  <main>
    <cardCube :height="client.height" @onChange="onChange" />
    <div>
      <div>
        <div class="card box-shadow" draggable="true" @dragstart="dragStart($event)">车位</div>
        <div class="card box-shadow" draggable="true" @dragstart="dragStart($event, 'static')">
          出口
        </div>
      </div>
      <div class="body">
        <div id="tutorial" @drop="drop" @dragover="dragOver">
          <edit-item :client="client" />
        </div>
      </div>
    </div>
    <editCard :height="client.height" />
  </main>
</template>
<style lang="less" scoped>
main {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.body {
  width: 900px;
  overflow: auto;
  #tutorial {
    height: 600px;
    width: 900px;
    position: relative;
    background-color: rgb(240, 238, 238);
  }
}

.card {
  width: 90px;
  height: 30px;
  display: inline-block;
  margin-bottom: 15px;
  text-align: center;
}

.arco-collapse {
  border: none;
}
</style>

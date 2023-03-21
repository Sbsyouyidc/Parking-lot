<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onActivated, nextTick, computed } from 'vue'

let index = 0
let curIndex: string
const ctx = ref()
let offset = {
  x: 0,
  y: 0
}

let client = {
  x: 0,
  y: 0
}
onActivated(() => {
  nextTick(() => {
    ctx.value = document.querySelector('#tutorial') as HTMLCanvasElement
    const { left, top } = ctx.value.getBoundingClientRect()
    client.x = left
    client.y = top
  })
})

ondragstart = (e: any) => {
  curIndex = e.target.dataset.index
  offset.x = e.layerX
  offset.y = e.layerY
}

const drop = (e: { clientX: any; clientY: any }) => {
  if (curIndex == '1123') {
    const cloneNode = document.querySelector('.card')?.cloneNode(true) as Element
    cloneNode.setAttribute('data-index', index.toString())
    cloneNode.setAttribute('draggable', 'false')
    index++
    const { clientX, clientY } = e
    cloneNode.setAttribute(
      'style',
      `position: absolute;left:${clientX - client.x - offset.x}px;top:${
        clientY - client.y - offset.y
      }px`
    )
    ctx.value.appendChild(cloneNode)
  }
}

ondragover = (e) => {
  e.preventDefault()
}

onmousedown = (e: any) => {
  curIndex = e.target.dataset.index
  console.log(e)

  if (curIndex !== '1123') {
    const ew = e
    const { layerX, layerY } = e
    const xe = layerX
    const ye = layerY

    document.onmousemove = (e: any) => {
      const { clientX, clientY } = e
      ew.target.style.left = clientX - xe - client.x + 'px'
      ew.target.style.top = clientY - ye - client.y + 'px'
    }
    document.onmouseup = () => {
      document.onmousemove = document.onmousedown = null
    }
  }
}
</script>

<template>
  <div class="parking-management">
    <div class="card box-shadow" color="green" draggable="true" data-index="1123">车位</div>
    <div id="tutorial" @drop="drop"></div>
  </div>
</template>
<style lang="less" scoped>
.parking-management {
  display: flex;
}
#tutorial {
  flex: 1;
  height: 600px;
  position: relative;
  border: 1px solid #74717163;
  overflow: auto;
  margin: 20px;
}
.card {
  cursor: pointer;
  text-align: center;
  line-height: 30px;
  width: 90px;
  height: 30px;
  background-color: aquamarine;
}
</style>

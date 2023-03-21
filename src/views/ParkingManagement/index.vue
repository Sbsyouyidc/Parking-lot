<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, onActivated, nextTick, computed } from 'vue'

let index = 1
let curIndex: string
const ctx = ref()
let das = {
  x: 0,
  y: 0
}

let client = {
  x: 0,
  y: 0
}
onActivated(() => {
  nextTick(() => {
    ctx.value = document.getElementById('tutorial') as HTMLCanvasElement
    const { left, top } = ctx.value.getBoundingClientRect()
    client.x = left
    client.y = top
  })
})

document.addEventListener('dragstart', (e: any) => {
  curIndex = e.target.dataset.index
  e.target.style.opacity = 0.5
  das.x = e.layerX
  das.y = e.layerY
})

const drop = (e: { clientX: any; clientY: any }) => {
  if (curIndex !== '1123') {
    const curNode = document.querySelector(`.card[data-index='${curIndex}']`) as Element
    const { clientX, clientY } = e

    curNode.setAttribute(
      'style',
      `position: absolute;left:${clientX - client.x - das.x}px;top:${clientY - client.y - das.y}px`
    )
  } else {
    const curNode = document.querySelector('.card') as Element
    const d = curNode.cloneNode(true) as Element
    d.setAttribute('data-index', index.toString())
    index++
    const { clientX, clientY } = e
    d.setAttribute(
      'style',
      `position: absolute;left:${clientX - client.x - das.x}px;top:${clientY - client.y - das.y}px`
    )
    ctx.value.appendChild(d)
  }
}

document.addEventListener('dragover', (e) => {
  e.preventDefault()
})
</script>

<template>
  <div class="parking-management">
    <div class="card" draggable="true" data-index="1123">123</div>
    <div id="tutorial" @drop="drop"></div>
  </div>
</template>
<style lang="less" scoped>
#tutorial {
  z-index: 10000;
  width: 600px;
  height: 600px;
  position: relative;
  border: 1px solid black;
  overflow: hidden;
}
.card {
  cursor: pointer;
  z-index: 9;
  width: 90px;
  height: 30px;
  background-color: #e5e5e5;
}
</style>

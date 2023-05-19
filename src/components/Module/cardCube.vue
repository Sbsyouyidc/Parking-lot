<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, nextTick, watchEffect } from 'vue'

import fetch from '@/request/fetch'
import { number } from 'echarts/core'
const cube = ref()
const prop = defineProps<{
  height: number
}>()
const floorSum = ref(0)
const floor = ref(1)
const emit = defineEmits<{ (e: 'onChange', val: number): void }>()
fetch.get(`/api/getFloor`).then((res) => {
  console.log(res)
  floorSum.value = res.result.length
})
const cubeClick = (e) => {
  floor.value = e.target.dataset.index
  emit('onChange', e.target.dataset.index)
}
</script>

<template>
  <div style="width: 150px">
    <div class="floor">当前楼层{{ floor }}</div>
    <div class="main" :style="{ height: prop.height + 'px' }">
      <div class="cardCube">
        <div class="cube" ref="cube" @click="cubeClick">
          <span
            v-for="index in floorSum"
            :style="{ '--i': index }"
            :key="index"
            :data-index="index"
            :class="{
              active: floor == index
            }"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.floor {
  background: #3b63488c;
  border-radius: 10px;
  padding: 10px;
  color: white;
  font-weight: 500;
}
.main {
  user-select: none;
  width: 150px;
  top: 200px;
  left: 75px;
}
.cardCube {
  position: relative;
  transform: skewY(-20deg);
}

.cube {
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  gap: 20px;
  span {
    cursor: pointer;
    position: relative;
    width: 70px;
    height: 15px;
    background: #5f5f5f;
    z-index: calc(var(--i));
  }
  & span::before {
    content: '';
    position: absolute;
    left: -60px;
    width: 60px;
    height: 100%;
    background: #908e8e;
    transform-origin: right;
    transform: skewY(45deg);
  }
  & span::after {
    content: '';
    position: absolute;
    left: 0;
    top: -59px;
    width: 100%;
    height: 60px;
    background: #b1aaaa;
    transform-origin: bottom;
    transform: skewX(45deg);
  }

  & span:hover {
    background: #094bac !important;
  }
  & span:hover::after {
    background: #394dff !important;
  }
  & span:hover::before {
    background: #0571ec !important;
  }
}
.active {
  background: #094bac !important;
}
.active::after {
  background: #394dff !important;
}
.active::before {
  background: #0571ec !important;
}
</style>

<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'

type Props = { isStop: false | true }

const props = withDefaults(defineProps<Props>(), {
  isStop: false
})
</script>

<template>
  <div :class="[props.isStop ? 'stopped' : 'not-stopped']" class="park">
    <span class="number">A01</span>
  </div>
</template>
<style lang="less" scoped>
.park {
  width: 90px;
  margin: 20px;
  height: 200px;
  cursor: pointer;
  position: relative;
  & > .number {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
    font-weight: bold;
  }
}
.not-stopped {
  background-color: rgba(0, 0, 255, 0.2);
  border: 3px dashed #00f;
}
.stopped {
  background-color: rgba(255, 0, 13, 0.2);
  border: 3px dashed rgb(238, 5, 5);
}
</style>

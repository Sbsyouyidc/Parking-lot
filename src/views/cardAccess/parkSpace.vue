<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import fetch from '@/request/fetch'
import { Notification } from '@arco-design/web-vue'
import { useParkInfoStore } from '@/stores/parkInfo'
type Props = { number: string | number; id: string; plate: string }

const props = withDefaults(defineProps<Props>(), {})
const store = useParkInfoStore()
const visible = ref(false)

const handleClick = () => {
  if (props.plate) {
    return
  } else {
    visible.value = true
  }
}
const handleOk = () => {
  fetch
    .put(`/api/parkingSpace/VehicleSelection/${props.id}`, {
      plate: store.plate as string
    })
    .then((result: { res: any; message: any }) => {
      const { res, message } = result
      if (res) {
        localStorage.setItem('number', props.number as string)
        store.spaceNumber = props.number
        Notification.success(message)
      } else {
        Notification.warning(message)
      }
      store.initStore()
    })

  visible.value = false
}
const handleCancel = () => {
  visible.value = false
}
</script>

<template>
  <a-popconfirm content="是否选择此车位" @ok="handleOk" @cancel="handleCancel" :disabled="!visible">
    <div :class="[props.plate ? 'stopped' : 'not-stopped']" class="park" @click="handleClick">
      <span v-if="props.plate" class="plate">{{ props.plate }}</span>
      <span class="number">{{ number }}</span>
    </div></a-popconfirm
  >
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
    font-weight: bold;
    right: 0;
    top: 0;
    font-size: 15px;
  }

  & > .plate {
    transform: translate(-50%, -50%);
    position: absolute;
    font-weight: bold;
    left: 50%;
    top: 50%;
    font-size: 15px;
    white-space: nowrap;
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

.body-class {
  & > .number {
    font-size: medium;
    font-weight: 400;
  }
}
</style>

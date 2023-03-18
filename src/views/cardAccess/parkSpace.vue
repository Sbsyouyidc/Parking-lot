<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import fetch from '@/request/fetch'
import { Notification } from '@arco-design/web-vue'
import { useParkInfoStore } from '@/stores/parkInfo'
type Props = {
  item: {
    id: string
    number: string
    status: string
    ParkingPlate: string
    type: string
    creationTime: string
    plate: string
  }
}
const store = useParkInfoStore()

const props = withDefaults(defineProps<Props>(), {})

const { item } = toRefs(props)

const handleOk = () => {
  fetch
    .put(`/api/parkingSpace/VehicleSelection/${item.value.id}`, {
      plate: store.plate
    })
    .then((result: { res: any; message: any }) => {
      const { res, message } = result
      if (res) {
        localStorage.setItem('spaceNumber', item.value.number)
        Notification.success(message)
      } else {
        Notification.warning(message)
      }
      store.initStore()
    })
}
</script>

<template>
  <a-popconfirm content="是否选择此车位" @ok="handleOk" :disabled="item.ParkingPlate !== ''">
    <div :class="[item.ParkingPlate ? 'stopped' : 'not-stopped']" class="park">
      <span v-if="item.ParkingPlate" class="plate">{{ item.ParkingPlate }}</span>
      <span class="number">{{ item.number }}</span>
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

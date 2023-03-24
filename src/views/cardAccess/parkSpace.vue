<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import fetch from '@/request/fetch'
import { Notification } from '@arco-design/web-vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import type { IData } from '@/stores/management'
import dayjs from 'dayjs'
type Props = {
  item: IData
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
        store.type = item.value.type
        localStorage.setItem('spaceNumber', item.value.number)
        Notification.success(message)
        store.initStore()
        store.VehicleDeparture().then(() => {
          visible.value = true
        })
      } else {
        Notification.warning(message)
      }
    })
}

const visible = ref(false)

const handleClick = () => {
  visible.value = true
}

const handleCancel = () => {
  visible.value = false
}

const data = [
  {
    label: '车位编号',
    value: item.value.number
  },
  {
    label: '车位类别',
    value: item.value.type
  },
  {
    label: '开始时间',
    value: dayjs(item.value.StartParkingTime).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    label: '停车',
    value: item.value.ParkingPlate
  }
]
</script>

<template>
  <a-drawer
    :width="340"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    unmountOnClose
    popup-container=".card-access"
    size="large"
  >
    <template #title> 车位详细 </template>
    <div>
      <a-descriptions style="margin-top: 20px" :data="data" :column="1" />
    </div>
  </a-drawer>

  <div
    :class="[item.ParkingPlate ? 'stopped' : 'not-stopped']"
    class="park"
    :style="{ left: item.coordinates.X + 'px', top: item.coordinates.Y + 'px' }"
    @click="handleClick"
  >
    <span v-if="item.ParkingPlate" class="plate">{{ item.ParkingPlate }}</span>
    <span class="number">{{ item.number }}</span>
  </div>
</template>
<style lang="less" scoped>
.park {
  width: 120px;
  height: 60px;
  cursor: pointer;
  position: absolute;
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
  border: 2px dashed #00f;
}
.stopped {
  background-color: rgba(255, 0, 13, 0.2);
  border: 2px dashed rgb(238, 5, 5);
}

.body-class {
  & > .number {
    font-size: medium;
    font-weight: 400;
  }
}
</style>

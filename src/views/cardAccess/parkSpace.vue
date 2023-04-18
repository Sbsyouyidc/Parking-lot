<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, toRefs, watchEffect, nextTick } from 'vue'
import fetch from '@/request/fetch'
import { Notification } from '@arco-design/web-vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import { useUserMainStore } from '@/stores/userMain'
import plateSelect from '@/components/Module/plateSelect.vue'
import type { IData } from '@/stores/management'
import dayjs from 'dayjs'
type Props = {
  item: IData
}

const store = useParkInfoStore()
const userStore = useUserMainStore()

watchEffect(() => {
  nextTick(() => {
    if (userStore.plate) {
      input.value = userStore.plate
    }
  })
})

const props = withDefaults(defineProps<Props>(), {})

const { item } = toRefs(props)

const handleOk = () => {
  fetch
    .put(`/api/parkingSpace/VehicleSelection/${item.value.id}`, {
      plate: input.value
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

const input = ref('')
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
      <a-descriptions style="margin-top: 20px" :column="1">
        <a-descriptions-item label="车位编号"> {{ item.number }} </a-descriptions-item>
        <a-descriptions-item label="开始时间">
          {{ dayjs(item.StartParkingTime).format('YYYY-MM-DD HH:mm:ss') }}
        </a-descriptions-item>
        <a-descriptions-item label="车位类别"> {{ item.type }} </a-descriptions-item>
        <a-descriptions-item label="停车">
          <span v-if="item.ParkingPlate">{{ item.ParkingPlate }}</span>
          <plateSelect @on-change="(val) => (input = val)" />
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-drawer>

  <div
    v-if="item.status == 'true'"
    :class="[item.ParkingPlate ? 'stopped' : 'not-stopped']"
    class="park"
    :style="{
      left: item.coordinates.X + 'px',
      top: item.coordinates.Y + 'px',
      transform: `rotate(${item.coordinates.degree}deg)`
    }"
    @click="handleClick"
  >
    <span v-if="item.ParkingPlate" class="plate">{{ item.ParkingPlate }}</span>
    <span class="number">{{ item.number }}</span>
  </div>
</template>
<style lang="less" scoped>
.park {
  width: 90px;
  height: 30px;
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

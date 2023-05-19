<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, toRefs, watchEffect, nextTick, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'

import fetch from '@/request/fetch'
import { Message, Notification } from '@arco-design/web-vue'
import { useParkInfoStore } from '@/stores/parkInfo'
import { useUserMainStore } from '@/stores/userMain'
import { useBlackStore } from '@/stores/black'
import plateSelect from '@/components/Module/plateSelect.vue'
import type { IData } from '@/stores/management'
import modal from '@/components/Module/modal.vue'

type Props = {
  item: IData
}

const store = useParkInfoStore()
const userStore = useUserMainStore()
const blackStore = useBlackStore()

watchEffect(() => {
  nextTick(() => {
    if (userStore.plate) {
      form.input = userStore.plate
    }
  })
})

const props = withDefaults(defineProps<Props>(), {})

const { item } = toRefs(props)
const { filterBlack } = storeToRefs(blackStore)

const handleOk = async () => {
  await blackStore.blackArray(form.input)
  if (filterBlack.value.length >= 3) {
    visible_model.value = !visible_model.value
    return
  }
  fetch
    .put(`/api/parkingSpace/VehicleSelection/${item.value.id}`, {
      plate: form.input,
      status: 'appointment',
      ReservationTime: form.value
    })
    .then((result: { res: any; message: any }) => {
      const { res, message } = result
      if (res) {
        store.type = item.value.type
        localStorage.setItem('spaceNumber', item.value.number)
        Message.success(message)
        store.initStore()
        store.switchFloor(store.floor)
        store.VehicleDuration().then(() => {
          visible.value = false
        })
      } else {
        Message.warning(message)
      }
    })
}

const visible = ref(false)

const handleClick = (type: string, status: string) => {
  console.log(type)
  if (type !== 'static' && status == 'true') {
    visible.value = true
  }
}

const handleCancel = () => {
  visible.value = false
}

const form = reactive({
  input: '',
  value: ''
})
const visible_model = ref(false)
</script>

<template>
  <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" width="auto">
    <template #title> 车位详细 </template>
    <div>
      <a-descriptions :column="1">
        <a-descriptions-item label="车位编号"> {{ item.number }} </a-descriptions-item>
        <a-descriptions-item label="车位类别"> {{ item.type }} </a-descriptions-item>
        <a-descriptions-item label="楼层"> {{ item.floor }} </a-descriptions-item>
        <a-descriptions-item label="停车">
          <span v-if="item.ParkingPlate">{{ item.ParkingPlate }}</span>
          <plateSelect v-else @on-change="(val) => (form.input = val)" />
        </a-descriptions-item>
        <a-descriptions-item label="预约时间">
          <a-date-picker
            v-model="form.value"
            :disabledDate="(current: string | number | dayjs.Dayjs | Date | null | undefined) => dayjs(current).isBefore(dayjs())"
            style="width: 220px"
            show-time
            format="YYYY-MM-DD hh:mm"
          />
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>

  <modal v-model:visible="visible_model">
    <div>
      {{ '未处理违规记录已到上线，请先处理违规记录' }}
    </div>
    <div>
      {{ '上限为3次，目前为' + filterBlack.length + '次' }}
    </div></modal
  >
  <div
    v-if="item.status !== 'false'"
    :class="[item.status, item.type == 'static' ? 'static' : 'park']"
    class="default"
    :style="{
      left: item.coordinates.X + 'px',
      top: item.coordinates.Y + 'px',
      transform: `rotate(${item.coordinates.degree}deg)`
    }"
    @click="handleClick(item.type, item.status)"
  >
    <span v-if="item.ParkingPlate" class="plate">{{ item.ParkingPlate }}</span>
    <span class="number">{{ item.number }}</span>
  </div>
</template>
<style lang="less" scoped>
.default {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  user-select: none;
  font-weight: bold;
}

.static {
  width: 60px;
  height: 90px;
  background: transparent !important;
  border-left: 1px solid rgb(0, 0, 0) !important;
  border-right: 1px solid rgb(0, 0, 0) !important;
}
.park {
  cursor: pointer;
  width: 50px;
  height: 90px;
  border: 2px dashed #00f;
  background-color: rgba(0, 0, 255, 0.2);
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
.true {
  background-color: rgba(65, 65, 65, 0.2);
  border: 2px dashed rgb(173, 173, 177);
}
.appointment {
  background-color: rgba(13, 36, 245, 0.2);
  border: 2px dashed rgb(19, 22, 219);
}
.parked {
  background-color: rgba(255, 0, 13, 0.2);
  border: 2px dashed rgb(238, 5, 5);
}
</style>

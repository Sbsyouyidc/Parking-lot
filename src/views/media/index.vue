<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import fetch from '@/request/fetch'
import { ref, reactive, onActivated, onBeforeUnmount, onDeactivated } from 'vue'
import { storeToRefs } from 'pinia'
import { Notification } from '@arco-design/web-vue'
import { file } from '@/util/index'
import { useParkInfoStore } from '@/stores/parkInfo'
import { useBlackStore } from '@/stores/black'
import modal from '@/components/Module/modal.vue'
import { emitter } from '@/util/index'
import History from './history.vue'
import { useHistoryStore } from './history'

const store = useParkInfoStore()
const historyStore = useHistoryStore()
const blackStore = useBlackStore()
const { filterBlack } = storeToRefs(blackStore)

const canvas = ref()
const video = ref()
const constraints = {
  audio: false,
  video: {
    width: 900,
    height: 800
  }
}

const visible_model = ref(false)

const takePhoto = () => {
  let ctx = canvas.value.getContext('2d')
  ctx.drawImage(video.value, 0, 0)
  const image = canvas.value.toDataURL('image/png')
  fetch.Upload('/api/upload', file(image), false).then((res: any) => {
    const { path } = res
    fetch
      .post('/api/entry', { imagePath: path }, false)
      .then(async (result: { message: any; params: any; res: any }) => {
        const {
          message,
          params: { plate, entryImage, leaveImage, leaveTime, entryTime },
          res
        } = result
        Notification.info(message)
        if (res !== 'false') {
          const history_arr = {
            image: '',
            plate,
            time: '',
            type: ''
          }
          if (res == 'entry') {
            ;[history_arr.image, history_arr.time, history_arr.type] = [entryImage, entryTime, res]
            await blackStore.blackArray(plate)
            if (filterBlack.value.length >= 3) {
              visible_model.value = !visible_model.value
              return
            }
            fetch
              .put(`/api/parkingSpace/VehicleSelection/${selectId(plate)}`, {
                plate
              })
              .then((result: { res: any; message: any }) => {
                const { res, message } = result
                if (res) {
                  Notification.success(message)
                  store.initStore()
                }
              })
          }
          if (res == 'leave') {
            ;[history_arr.image, history_arr.time, history_arr.type] = [leaveImage, leaveTime, res]
            emitter.emit(res, { plate, status: 'parked' })
          }
          historyStore.$patch((state) => {
            state.state.push(history_arr)
          })
        }
      })
  })
}
const selectId = (plate: string) => {
  const index = store.parkinfoArray.findIndex((item) => item.ParkingPlate == plate)
  if (index !== -1) {
    return store.parkinfoArray[index].id
  } else {
    return store.parkinfoArray.filter((item) => item.ParkingPlate == null)[0].id
  }
}
onActivated(async () => {
  store.initStore()
  const videoStream = await navigator.mediaDevices.getUserMedia(constraints)
  video.value.srcObject = videoStream
})

onDeactivated(() => {
  const stream = video.value.srcObject
  const tracks = stream.getTracks()
  tracks.forEach(function (track: { stop: () => void }) {
    track.stop() //停止视频流
  })
  video.value.srcObject = null
})
</script>

<template>
  <modal v-model:visible="visible_model">
    <div>
      {{ '未处理违规记录已到上线，请先处理违规记录' }}
    </div>
    <div>
      {{ '上限为3次，目前为' + filterBlack.length + '次' }}
    </div></modal
  >
  <div class="media">
    <a-button @click="() => takePhoto()">拍照</a-button>

    <video autoplay ref="video" id="video"></video>

    <history />
  </div>
  <canvas id="canvas" ref="canvas" width="900" height="800"></canvas>
</template>
<style lang="less" scoped>
.media {
  display: flex;
  justify-content: space-around;
}
.list {
  width: 300px;
  height: 300px;
}
#video {
  margin-left: 20px;
  min-width: 100px;
}
#canvas {
  display: none;
}
</style>

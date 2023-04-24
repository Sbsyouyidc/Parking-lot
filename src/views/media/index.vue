<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import fetch from '@/request/fetch'
import dayjs from 'dayjs'

import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { file } from '@/util/index'
import { Notification } from '@arco-design/web-vue'
const canvas = ref()
const video = ref()


const constraints = {
  audio: false,
  video: {
    width: 900,
    height: 800
  }
}

const takePhoto = () => {
  let ctx = canvas.value.getContext('2d')
  ctx.drawImage(video.value, 0, 0)
  const image = canvas.value.toDataURL('image/png')
  fetch.Upload('/api/upload', file(image), false).then((res: any) => {
    const { path } = res
    fetch.post('/api/entry', { imagePath: path }, false).then((res) => {
      Notification.info(res.message)
    })
  })
}

onMounted(async () => {
  const videoStream = await navigator.mediaDevices.getUserMedia(constraints)
  video.value.srcObject = videoStream
})
onBeforeUnmount(() => {
  const stream = video.value.srcObject
  const tracks = stream.getTracks()
  tracks.forEach(function (track: { stop: () => void }) {
    track.stop() //停止视频流
  })
  video.value.srcObject = null
})
</script>

<template>

  <div class="media">
    <a-button @click="() => takePhoto()">拍照</a-button>
    <a-card class="list">123</a-card>
    <video autoplay ref="video" id="video"></video>
  </div>
  <canvas id="canvas" ref="canvas" width="900" height="800"></canvas>
</template>
<style lang="less" scoped>
.media {
  display: flex;
  height: 100%;
}
.list {
  width: 300px;
  height: 300px;
}
#video {
  height: 400px;
  width: 300px;
}
#canvas {
  visibility: hidden;
}
upload {
  visibility: hidden;
}
</style>

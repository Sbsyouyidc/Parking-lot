<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import { ref, reactive, shallowRef, onMounted, nextTick } from 'vue'

const map = shallowRef()
const indoorMap = shallowRef()
const init = () => {
  AMapLoader.load({
    key: 'e9ba2f87bed7d71591005a698e666b6e', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.IndoorMap'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((res) => {
      const indoorMap = new res.IndoorMap()
      map.value = new res.Map('container', {
        //设置地图容器id
        viewMode: '2D', //是否为3D地图模式
        zoom: 5, //初始化地图级别
        layers: [indoorMap]
      })
      indoorMap.showIndoorMap('B000A9VHIG')
      indoorMap.on('click', (e) => {
        console.log(e)

        // const canvas = document.getElementsByClassName('amap-layer') as any
        // const dataUrl = canvas[0].toDataURL()
        // console.log(dataUrl)

        // nextTick(() => {
        //   const mark = document.querySelector('.amap-markers')
        //   console.log(mark)
        // })
      })
    })
    .catch((e) => {
      console.log(e)
    })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div id="container"></div>
</template>
<style lang="less" scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 600px;
}
</style>

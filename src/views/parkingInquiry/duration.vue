<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useMessageStore } from '@/stores/message'
import { Duration } from '@/util'
import dayjs from 'dayjs'
import { ref, onBeforeUnmount } from 'vue'
type Props = {
  time: string
}
onBeforeUnmount(() => {
  clearInterval(timer as number)
  timer = null
})
const messageStore = useMessageStore()
const limit = messageStore.limit
const props = defineProps<Props>()
const duration = ref()
let timer: number | null = setInterval(() => {
  duration.value = Duration(dayjs().diff(dayjs(props.time)))!
  // const time = dayjs().diff(dayjs(item.value.StartParkingTime))
  // if (time % limit <= Math.floor(limit / 10)) {
  //   const text =
  //     params.value.plate +
  //     `在编号${item.value.number}车位` +
  //     '停放时间已到达' +
  //     duration.value +
  //     '，检查停放情况'
  //   messageStore.postMessage('abnormal', text)
  // }
}, 1000)

</script>

<template>
  <div class="duration">{{ duration }}</div>
</template>
<style lang="less" scoped></style>

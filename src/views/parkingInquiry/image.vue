<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import fetch from '@/request/fetch'
import { ref, reactive, watchEffect } from 'vue'

type Props = {
  plate: string | null
}
const loading = ref(true)
const props = defineProps<Props>()
watchEffect(() => {
  if (props.plate) {
    fetch.get(`/api/getPlateImage?plate=${props.plate}`, false).then((res: { entryImage: any }) => {
      image.value = res.entryImage
      loading.value = !loading.value
    })
  }
})
const image = ref()
</script>

<template>
  <div class="table-image">
    <a-skeleton animation v-show="loading">
      <a-skeleton-shape size="large" />
    </a-skeleton>
    <a-image v-show="!loading" :src="`http://localhost:3000/static/images/${image}`" width="100" />
  </div>
</template>
<style lang="less" scoped></style>

<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, toRefs, computed } from 'vue'
import { Duration } from '@/util/index'
const props = defineProps<{
  obj: { Price: string; PriceDetails: { [key: string]: string | number }[] }
  id: string
}>()

const { obj, id } = toRefs(props)
const detail = computed(() => obj.value.PriceDetails.filter((item, index) => index !== 0))
</script>

<template>
  <a-card class="res-detail box-shadow" :title="`订单号${id}`">
    <div>
      总时长<a-tag>{{ Duration(obj.PriceDetails[0].Remaining as number) }}</a-tag>
    </div>
    <div>时长收费明细</div>
    <div>时间段</div>
    <a-card v-for="(item, index) in detail" :key="index">
      <a-descriptions :data="item" :column="1">
        <a-descriptions-item label="开始时间"> {{ item.StartClock }}小时 </a-descriptions-item>
        <a-descriptions-item label="结束时间"> {{ item.EndClock }}小时 </a-descriptions-item>
        <a-descriptions-item label="时间段结算">
          <a-tag> {{ item.settlement }} 元</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <div class="sum">总收费 {{ obj.Price }}元</div>
  </a-card>
</template>
<style lang="less" scoped>
.res-detail {
  margin: 0 auto;
  font-weight: bold;
  padding: 10px;
  font-family: sans-serif;
  & div {
    margin: 5px;
  }
  .sum {
    margin-top: 10px;
    text-align: right;
  }
}

@media screen and (min-width: 700px) {
  .res-detail {
    width: 700px;
  }
}
@media screen and (max-width: 390px) {
  .res-detail {
    display: flex;
    flex-direction: column;
  }
}
</style>

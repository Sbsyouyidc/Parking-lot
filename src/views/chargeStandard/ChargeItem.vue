<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, watch, computed, toRefs } from 'vue'
import { IconPlus, IconMinus } from '@arco-design/web-vue/es/icon'

const props = withDefaults(
  defineProps<{
    item: {
      id: string
      type: string
      StartClock: string
      EndClock: string
      HourlyCharge: string
    }
    index: number
    type: string
  }>(),
  {}
)
const { item: from } = toRefs(props)
const emit = defineEmits<{
  (e: 'on-delete', id: string, type: string): void
}>()

const click = () => {
  emit('on-delete', props.index, props.type)
}
</script>

<template>
  <div class="Item">
    <a-space>
      <a-input :style="{ maxWidth: '220px' }" allow-clear v-model="from.StartClock">
        <template #append> 小时 </template> </a-input
      >-
      <a-input :style="{ maxWidth: '220px' }" allow-clear v-model="from.EndClock">
        <template #append> 小时 </template>
      </a-input>
      <a-input :style="{ maxWidth: '220px' }" allow-clear v-model="from.HourlyCharge">
        <template #append> 元/小时 </template>
      </a-input>
      <span class="iii" v-if="index !== 0">
        <a-button @click="click"><IconMinus /></a-button
      ></span>
      <span class="iii" v-else></span>
    </a-space>
  </div>
</template>
<style lang="less" scoped>
.Item {
  margin-bottom: 10px;
}
.iii {
  width: 50px;
  margin: 0px 10px 0px 10px;
}
</style>

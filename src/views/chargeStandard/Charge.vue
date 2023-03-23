<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, computed, toRefs, watch } from 'vue'
import ChargeItem from './ChargeItem.vue'
import { IconPlus, IconDelete } from '@arco-design/web-vue/es/icon'
import fetch from '@/request/fetch'
type IValue = {
  [key: string]: any
}
const props = withDefaults(
  defineProps<{
    data: IValue
  }>(),
  {}
)
const { data } = toRefs(props)
const emit = defineEmits<{
  (e: 'on-addItem', item: IValue, type: string): void
  (e: 'on-allDelete', type: string): void
}>()

const addItems = (type: string) => {
  const item = { type, StartClock: '', EndClock: '', HourlyCharge: '' }
  emit('on-addItem', item, type)
}
</script>

<template>
  <div class="Charge" v-for="(type, index) in Object.keys(data)" :key="index">
    <a-collapse>
      <!-- <a-input type="text" placeholder="Please enter something" /> -->
      <a-collapse-item :header="type" key="1">
        <div v-for="(childItem, indexc) in data[type].group" :key="indexc">
          <ChargeItem :type="type" :item="childItem" :index="indexc" v-bind="$attrs" />
        </div>
        <a-button-group>
          <a-button @click="addItems(type)"><IconPlus /></a-button>
        </a-button-group>
      </a-collapse-item>
    </a-collapse>
    <a-button @click="() => emit('on-allDelete', type)">
      <icon-delete />
    </a-button>
  </div>
</template>
<style lang="less" scoped>
.arco-collapse {
  margin: 20px;
  .arco-collapse-item {
    position: relative;
  }
  & > :deep(.arco-input-wrapper) {
    top: 0px;
    height: 40px;
    left: 33px;
    width: 90px;
    background-color: #ffffff;
    position: absolute;
    z-index: 10000;
  }
}
.Charge {
  max-width: 950px;
  margin-right: 20px;
  & > .arco-btn {
    position: absolute;
    right: -35px;
    top: 10px;
  }
}
.arco-btn-group {
  margin: 10px;
}
</style>

<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, computed, toRefs, watch } from 'vue'
import ChargeItem from './ChargeItem.vue'
import { IconPlus, IconMinus } from '@arco-design/web-vue/es/icon'

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
const emit = defineEmits<{ (e: 'update:data', Object: any): void }>()

const onDelete = (id: any, type: string) => {
  data.value[type].group = data.value[type].group.filter((item: any) => item.id !== id)
}

watch(data, (val) => {
  console.log(val)
  emit('update:data', val)
})
</script>

<template>
  <div>{{ data }}</div>
  <div class="Charge" style="width: 900px">
    <a-collapse v-for="(type, index) in Object.keys(data)" :key="index">
      <!-- <a-input type="text" placeholder="Please enter something" /> -->
      <a-collapse-item :header="type" key="1">
        <div v-for="(childItem, indexc) in data[type].group" :key="indexc">
          <ChargeItem :id="childItem.id" :type="type" @on-delete="onDelete" />
        </div>
        <a-button-group>
          <a-button @click="data[type].group.push({ id: '1', num: 1 })"><IconPlus /></a-button>
          <a-button @click="data[type].group.pop()"><IconMinus /></a-button>
        </a-button-group>
      </a-collapse-item>
    </a-collapse>
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
.arco-btn-group {
  margin: 10px;
}
</style>

<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import ChargeItem from './ChargeItem.vue'
import { IconPlus, IconMinus } from '@arco-design/web-vue/es/icon'

const value = reactive<{ [key: string]: number }[]>([
  {
    item: 1
  },
  { item: 2 }
])
</script>

<template>
  <div class="Charge">
    <a-collapse v-for="item in value" :key="item">
      {{ item }}
      <a-collapse-item header="轿车" key="1">
        <div v-for="childItem in item.item" :key="childItem"><ChargeItem /></div>
        <a-button-group>
          <a-button @click="item.item++"><IconPlus /></a-button>
          <a-button @click="item.item--"><IconMinus /></a-button>
        </a-button-group>
      </a-collapse-item>
    </a-collapse>
  </div>
</template>
<style lang="less" scoped>
.arco-collapse {
  margin: 20px;
}
.arco-btn-group {
  margin: 10px;
}
</style>

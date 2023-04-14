<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useShowPanelStore } from './store'
import { storeToRefs } from 'pinia'

const store = useShowPanelStore()
const { admissionArray } = storeToRefs(store)

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])

onMounted(async () => {
  await store.getOrderRecord()
  const myChart = echarts.init(document.getElementById('main') as HTMLElement)
  window.addEventListener('resize', myChart.resize)
  myChart.setOption(option.value)
})

const option = computed(() => {
  return {
    tooltip: {
      trigger: 'axis'
    },
    legend: {},

    xAxis: {
      type: 'category',
      boundaryGap: false,
      name: '日期',
      data: Object.keys(admissionArray.value)
    },
    yAxis: {
      type: 'value',
      name: '辆'
    },
    series: [
      {
        name: '车辆入场',
        type: 'line',
        data: Object.values(admissionArray.value),
        label: {
          show: true,
          textStyle: {
            fontSize: 15
          }
        }
      }
    ]
  }
})
</script>

<template>
  <div id="main"></div>
</template>

<style lang="less" scoped>
#main {
  margin: 0 auto;
  height: 500px;
}
</style>

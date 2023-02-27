<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import headerMenu from './header/header-menu.vue'
import siderMenu from './sider/sider-menu.vue'
const isCollapsed = ref(false)
const layoutLeft = ref<number>(200)
watch(isCollapsed, (val) => {
  layoutLeft.value = val ? 48 : 200
})
let count = 5
const data = ref([
  {
    key: '1',
    title: 'Tab 1',
    content:
      'Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1Content of Tab Panel 1'
  },
  {
    key: '2',
    title: 'Tab 2',
    content: 'Content of Tab Panel 2'
  },
  {
    key: '3',
    title: 'Tab 3',
    content: 'Content of Tab Panel 3'
  },
  {
    key: '4',
    title: 'Tab 4',
    content: 'Content of Tab Panel 4'
  }
])

const handleAdd = () => {
  const number = count++
  data.value = data.value.concat({
    key: `${number}`,
    title: `New Tab ${number}`,
    content: `Content of New Tab Panel ${number}`
  })
}
const handleDelete = (key) => {
  data.value = data.value.filter((item) => item.key !== key)
}
</script>

<template>
  <div class="layout">
    <a-layout-header>
      <headerMenu />
    </a-layout-header>
    <a-layout-sider :collapsed="isCollapsed">
      <siderMenu @on-collapse="isCollapsed = !isCollapsed" />
    </a-layout-sider>

    <a-layout :style="{ 'margin-left': layoutLeft + 'px' }">
      <a-layout-content>
        <a-tabs
          type="line"
          :editable="true"
          @add="handleAdd"
          @delete="handleDelete"
          show-add-button
          auto-switch
        >
          <a-tab-pane
            v-for="(item, index) of data"
            :key="item.key"
            :title="item.title"
            :closable="index !== 2"
          >
            {{ item?.content }}
          </a-tab-pane>
        </a-tabs>
      </a-layout-content>
      <a-layout-footer>ss</a-layout-footer>
    </a-layout>
  </div>
</template>
<style lang="less" scoped>
.layout {
  height: 100%;

  & .arco-layout-header {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 64px;
  }

  &:deep(.arco-layout-sider) {
    position: fixed;
    z-index: 999;
    top: 64px;
    left: 0;
    right: 0;
    height: calc(100% - 64px);
  }

  & :deep(.arco-layout-content) {
    flex-wrap: wrap;
    background-color: var(--color-background);
    padding: 10px;
  }

  & :deep(.arco-layout-header),
  :deep(.arco-layout-footer),
  :deep(.arco-layout-content),
  :deep(.arco-layout-sider-children) {
    display: flex;
    flex-direction: row;
    font-stretch: condensed;
  }

  & :deep(.arco-layout-footer) {
    height: 64px;
    background-color: var(--color-primary-light-4);
  }
}
.arco-layout {
  padding-top: 64px;
  height: 100%;
  transition: all 0.1s;
}
.arco-tabs {
  width: 100%;
  & .arco-tabs-nav-tab {
    height: 40px;
  }
}
</style>

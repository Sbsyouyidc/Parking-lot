<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import headerMenu from './header/header-menu.vue'
import siderMenu from './sider/sider-menu.vue'

const isCollapsed = ref(false)
const router = useRouter()
const route = useRoute()
const layoutLeft = computed(() => (isCollapsed.value ? 48 : 200))

watch(
  () => route.name,
  (val) => {
    const {
      meta: { title }
    } = route
    const isHave = data.value.some((item) => item.key == val)
    !isHave && data.value.push({ key: val as string, title: title as string })
    activeKey.value = val as string
  }
)

const data = ref<{ key: string; title: string }[]>([])

const handleDelete = (key: string) => {
  const index = data.value.findIndex((item) => item.key == key)
  data.value = data.value.filter((item) => item.key !== key)
  if (data.value.length === 0) {
    router.push({ name: 'Home' })
  } else if (index == data.value.length) {
    activeKey.value = data.value[index - 1].key
    router.push({ name: data.value[index - 1].key })
  } else {
    activeKey.value = data.value[index].key
    router.push({ name: data.value[index].key })
  }
}
const activeKey = ref('')
</script>

<template>
  <div class="layout">
    <a-layout-header class="box-shadow">
      <headerMenu />
    </a-layout-header>
    <a-layout-sider :collapsed="isCollapsed">
      <siderMenu @on-collapse="isCollapsed = !isCollapsed" />
    </a-layout-sider>

    <a-layout :style="{ 'margin-left': layoutLeft + 'px' }">
      <a-layout-content>
        <a-tabs type="line" :editable="true" @delete="handleDelete" :active-key="activeKey">
          <a-tab-pane v-for="(item, index) of data" :key="item.key" :title="item.title">
            <div class="a"></div>
            <div class="a"></div>
            <div class="a"></div>
            <div class="a"></div>
            <div class="a"></div>
            <div class="a"></div>
            <div class="a"></div>
            <div class="a"></div>
            <div class="a"></div>
            <div class="a"></div>
            <div class="a"></div>
            <div class="a"></div>
            <div class="a"></div>
            <div class="a"></div>
            <div class="a"></div>
            <div class="a"></div>
          </a-tab-pane>
        </a-tabs>
      </a-layout-content>
      <a-layout-footer></a-layout-footer>
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
    z-index: 998;
    top: 65px;
    left: 0;
    right: 0;
    height: calc(100% - 64px);
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
  background-color: #f4f6f9;
  & :deep(.arco-tabs-nav-tab) {
    background-color: #ffffff;
    top: 64px;
    width: 100%;
    height: 40px;
    position: fixed;
    z-index: 998;
    box-shadow: 5px 1px 5px 0 rgb(0 0 0 / 8%);
    & :deep(.arco-tabs-tab) {
      border: none;
    }
  }
  & :deep(.arco-tabs-content) {
    margin-top: 70px;
    padding: 0px 15px 0px 15px;
  }
  & :deep(.arco-tabs-pane) {
    flex-wrap: wrap;
    display: flex;
  }
}
.a {
  background-color: rgba(0, 0, 255, 0.2);
  border: 3px solid #00f;
  width: 90px;
  margin: 20px;
  height: 200px;
  cursor: pointer;
}
</style>

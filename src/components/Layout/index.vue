<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import headerMenu from './header/header-menu.vue'
import siderMenu from './sider/sider-menu.vue'
const router = useRouter()
const route = useRoute()

const isCollapsed = ref(false)
const layoutLeft = computed(() => (isCollapsed.value ? 48 : 200))
const activeKey = ref('')
const isMonitoring = ref(true)
const data = ref<{ key: string; title: string }[]>([])
watchEffect(() => {
  const {
    meta: { title },
    name
  } = route
  if (isMonitoring.value) {
    const isHave = data.value.some((item) => item.key == name)
    !isHave && data.value.push({ key: name as string, title: title as string })
    activeKey.value = name as string
  } else {
    isMonitoring.value = true
  }
})

const handleDelete = (key: string) => {
  const index = data.value.findIndex((item) => item.key == key)
  data.value = data.value.filter((item: any) => item.key !== key)

  if (data.value.length === 0) {
    router.push({ name: 'Panel' })
  }
  if (activeKey.value == key) {
    activeKey.value = data.value[index - 1].key
    router.push({ name: activeKey.value })
    isMonitoring.value = false
  }
}
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
        <a-tabs
          type="line"
          :editable="true"
          @delete="handleDelete"
          v-model:active-key="activeKey"
          @tab-click="(	
key: string) => router.push({ name: key })"
        >
          <a-tab-pane v-for="item in data" :key="item.key" :title="item.title">
            <RouterView v-slot="{ Component, route }">
              <keep-alive> <component :is="route.name == item.key && Component" /> </keep-alive
            ></RouterView>
          </a-tab-pane>
        </a-tabs>
      </a-layout-content>
      <!-- <a-layout-footer></a-layout-footer> -->
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
    z-index: 997;
    box-shadow: 5px 1px 5px 0 rgb(0 0 0 / 8%);
    & :deep(.arco-tabs-tab) {
      border: none;
    }
  }
  & :deep(.arco-tabs-content) {
    margin-top: 70px;
    padding: 0px 25px 25px 25px;
  }
}
</style>

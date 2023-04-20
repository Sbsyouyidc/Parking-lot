<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useUserMainStore } from '@/stores/userMain'
import { useBlackStore } from '@/stores/black'
import { storeToRefs } from 'pinia'
import { ref, reactive, toRaw } from 'vue'
import dayjs from 'dayjs'
const blackStore = useBlackStore()
const change = (e: any[]) => {
  blackStore.$patch((state) => {
    state.handlingArr = e
  })
}
const click = () => {
  blackStore.blackProcess()
}
</script>

<template>
  <a-typography-title :heading="6">
    待处理违规记录
    <a-button style="margin-bottom: 10px; float: right" type="primary" @click="click"
      >申请处理</a-button
    >
  </a-typography-title>

  <a-checkbox-group @change="change">
    <template v-for="idx in blackStore.filterBlack" :key="idx">
      <a-checkbox :value="idx.id">
        <template #checkbox="{ checked }">
          <a-space
            align="baseline"
            class="custom-checkbox-card"
            :class="{ 'custom-checkbox-card-checked': checked }"
          >
            <div className="custom-checkbox-card-mask">
              <div className="custom-checkbox-card-mask-dot" />
            </div>
            <div className="custom-checkbox-card-title">
              <div class="item">
                <div>违规编号</div>
                <div>{{ idx.id }}</div>
              </div>
              <div class="item">
                <div>违规情况</div>
                <div>{{ idx.Irregularities }}</div>
              </div>
              <div class="item">
                <div>处理状态</div>
                <div>{{ blackStore.status[idx.status].label }}</div>
              </div>
              <span class="date">{{ dayjs(idx.dateTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
          </a-space>
        </template>
      </a-checkbox>
    </template>
  </a-checkbox-group>
</template>
<style lang="less" scoped>
.item {
  display: flex;
  justify-content: space-between;
  & div:nth-child(1) {
    color: var(--color-neutral-6);
  }
  & ~ & {
    margin-top: 5px;
  }
}

.date {
  float: right;
}
.arco-list-wrapper {
  margin-bottom: 10px;
}
.arco-checkbox-group {
  background: white;
}
.arco-checkbox {
  width: 100%;
  padding: 0 !important;
  .custom-checkbox-card {
    padding: 10px 16px;
    border: 1px solid var(--color-border-2);
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
    :deep(& .arco-space-item:nth-child(2)) {
      flex: 1;
    }
  }
  .custom-checkbox-card-mask {
    height: 14px;
    width: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    border: 1px solid var(--color-border-2);
    box-sizing: border-box;
  }

  .custom-checkbox-card-mask-dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
  }

  .custom-checkbox-card-title {
    color: var(--color-text-1);
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 8px;
    width: 100%;
  }

  .custom-checkbox-card-checked,
  .custom-checkbox-card-checked .custom-checkbox-card-mask {
    border-color: rgb(var(--primary-6));
  }

  .custom-checkbox-card-checked .custom-checkbox-card-mask-dot {
    background-color: rgb(var(--primary-6));
  }
}
</style>

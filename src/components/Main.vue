<script setup lang="ts">
import DataItem from './DataItem.vue'
import { useAppStore } from '../stores/app'
import { useLibraryStore } from '../stores/library'
const app = useAppStore()
const libraryStore = useLibraryStore()
</script>

<template>
  <div class="main-body" v-if="app.libraryPath.length > 0 && app.firstChoosedDir == 2">
    <el-scrollbar class="items" :style="{ width: app.listWidthPercent + '%' }">
      <transition-group name="list" tag="div">
        <DataItem
          v-for="id in libraryStore.libraryListIds"
          v-bind:key="id"
          :data="libraryStore.libraryData[id]"
        />
      </transition-group>
    </el-scrollbar>
    <div class="detail" :style="{ width: 1 - app.listWidthPercent + '%' }"></div>
  </div>
  <div class="first" v-if="!app.libraryPath.length || app.firstChoosedDir < 2">
    <p style="width: 100%; text-align: center" v-if="app.firstChoosedDir == 0">
      {{ $t('EmptyLibraryPath') }}
    </p>
    <p style="width: 100%; text-align: center" v-if="app.firstChoosedDir == 1">
      {{ $t('FirstChooseLibraryPath') }} {{ $t('UpdateMedia') }} {{ $t('Button') }}
    </p>
    <p style="width: 100%; text-align: center" v-if="app.firstChoosedDir == 0">
      <el-button type="primary" @click="app.chooseDirectory(true)">{{
        $t('ChooseDirectory')
      }}</el-button>
    </p>
  </div>
</template>
<style scoped>
.main-body,
.first {
  height: calc(100vh - 130px);
  overflow: auto;
}
.detail {
  height: calc(100vh - 130px);
  overflow: auto;
}
.main-body {
  display: flex;
}

.first {
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  font-size: 18px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
</style>

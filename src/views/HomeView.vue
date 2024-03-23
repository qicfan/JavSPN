<script setup lang="ts">
import IconButton from '../components/IconButton.vue'
import Main from '../components/Main.vue'
import LanguageSwtich from '../components/LanguageSwitch.vue'
import { useStatusStore } from '../stores/status'
import { useAppStore } from '../stores/app'
import { useLibraryStore } from '../stores/library'
import { i18n } from '../i18n'
import logo from '../assets/icon.png'

const app = useAppStore()
const statusStore = useStatusStore()
const libraryStore = useLibraryStore()

libraryStore.loadLocalLibrary()
/**
 * 更新媒体库
 */
const updateLibraries = async () => {
  const pathes = app.libraryPath
  statusStore.setLoading()
  for (const idx in pathes) {
    const i = parseInt(idx) + 1
    statusStore.setCurrentOperation(i18n.global.t('UpdateMedia') + ` ${i}/${pathes.length}`)
    const p = pathes[idx]
    await libraryStore.updateLibrary(p)
  }
  statusStore.reset()
}

const scrape = () => {
  statusStore.op(i18n.global.t('Scrape'))
  libraryStore.scrape().then(() => {
    statusStore.op(i18n.global.t('OPSaveLibraryData'))
    libraryStore.saveLibraryData().then(() => {
      statusStore.reset()
    })
  })
}

const openSetting = () => {
  window.electronAPI.openSetting()
}
</script>

<template>
  <div
    class="common-layout"
    style="height: 100%"
    v-loading="libraryStore.initLoading"
    :element-loading-text="$t('InitLoadingText')"
  ></div>
  <div class="common-layout" v-if="!libraryStore.initLoading">
    <el-container>
      <el-header>
        <div class="icon-buttons header-row">
          <div style="width: 50%">
            <div style="display: flex; justify-content: start; align-items: center">
              <el-image class="logo" :src="logo" fit="contain" />
              <IconButton
                class="icon-button"
                :title="$t('UpdateMedia')"
                icon="Refresh"
                color="#20c4f9"
                :loading="statusStore.loading"
                @buttonClick="updateLibraries"
              />
              <IconButton
                class="icon-button"
                :title="$t('Scrape')"
                icon="Search"
                color="#c525e5"
                :loading="statusStore.loading"
                @buttonClick="scrape"
              />
              <IconButton
                class="icon-button"
                :title="$t('RenameFiles')"
                icon="Files"
                color="#d3750d"
                :loading="statusStore.loading"
              />
            </div>
          </div>
          <div style="width: 50%">
            <div style="display: flex; justify-content: end; align-items: center">
              <IconButton
                class="icon-button"
                :title="$t('Setting')"
                icon="Setting"
                color="#20c4f9"
                @buttonClick="openSetting"
              />
              <IconButton
                class="icon-button"
                :title="$t('CheckUpdate')"
                icon="Bottom"
                color="#1fd00e"
              />
              <LanguageSwtich class="icon-button" />
            </div>
          </div>
        </div>
      </el-header>
      <el-main>
        <Main />
      </el-main>
      <el-footer>
        <div class="icon-buttons" style="height: 100%">
          <div></div>
          <div style="display: flex; justify-content: end; align-items: center">
            <div style="margin-right: 20px" v-if="statusStore.currentOperation">
              {{ statusStore.currentOperation }}...
            </div>
            <div class="loading" v-loading="statusStore.loading"></div>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.el-header {
  line-height: 1.5;
  height: 100px;
  background: #efeae8;
}
.common-layout {
  width: 100%;
  margin: 0;
  padding: 0;
}
.header-row {
  height: 100%;
}

.logo {
  width: 60px;
  height: 60px;
}

.icon-button {
  text-align: center;
  cursor: pointer;
}
.el-main {
  margin: 0px;
  padding: 0px;
}
.el-footer {
  border-top: 1px solid #ccc;
  height: 30px;
}

.el-footer .loading {
  --el-loading-spinner-size: 28px;
  width: 28px;
  height: 28px;
}

.icon-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon-button {
  margin-left: 10px;
}
</style>

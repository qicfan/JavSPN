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

window.electronAPI.onEditLibraryPath(() => {
  console.log('reload app config')
  app.reload()
})

libraryStore.loadLocalLibrary().then((rs) => {
  statusStore.setResult(i18n.global.t('LoadLocalLibraryResult', { count: rs }))
})
/**
 * 更新媒体库
 */
const updateLibraries = async () => {
  const pathes = app.libraryPath
  statusStore.setLoading()
  statusStore.setResult('')
  const t = pathes.length
  const rsCount = { t: 0, w: 0, e: 0 }
  for (const idx in pathes) {
    const p = pathes[idx]
    const i = parseInt(idx) + 1
    const op = i18n.global.t('Scaning', { i, t, p })
    statusStore.setCurrentOperation(op)
    const rs: any = await libraryStore.updateLibrary(p)
    rsCount.t += rs.t
    rsCount.e += rs.e
    rsCount.w += rs.w
  }
  statusStore.setResult(i18n.global.t('ScanResult', rsCount))
  statusStore.reset()
}

const scrape = () => {
  statusStore.op(i18n.global.t('Scrape'))
  statusStore.setResult(i18n.global.t('ScrapeWarning'))
  libraryStore.scrape().then((rs: any) => {
    statusStore.setResult(i18n.global.t('ScrapeFinish', rs))
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
    v-loading="libraryStore.initLoading"
    :element-loading-text="$t('InitLoadingText')"
  >
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
              <!-- <IconButton
                class="icon-button"
                :title="$t('RenameFiles')"
                icon="Files"
                color="#d3750d"
                :loading="statusStore.loading"
              /> -->
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
              <!-- <IconButton
                class="icon-button"
                :title="$t('CheckUpdate')"
                icon="Bottom"
                color="#1fd00e"
              /> -->
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
          <el-text truncated style="width: 50%">{{ statusStore.result }}</el-text>
          <div style="display: flex; justify-content: end; align-items: center; width: 50%">
            <el-text
              truncated
              style="width: 70%; margin-right: 20px; text-align: right"
              v-if="statusStore.currentOperation"
            >
              {{ statusStore.currentOperation }}
            </el-text>
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
  width: 100vw;
  height: calc(100vh - 130px);
  overflow: auto;
}
.el-footer {
  border-top: 1px solid #ccc;
  height: 30px;
  width: 100vw;
  overflow: auto;
}

.el-footer .loading {
  --el-loading-spinner-size: 20px;
  width: 28px;
  height: 28px;
}

.icon-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon-button {
  margin-left: 20px;
}
</style>

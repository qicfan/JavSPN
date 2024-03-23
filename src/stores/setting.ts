import { ref } from 'vue'

import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', () => {
  const settings = ref(null)
  const loadIni = () => {
    window.electronAPI.loadIni()
    window.electronAPI.onLoadIniFinish((data: any) => {
      settings.value = data
    })
  }

  return { settings, loadIni }
})

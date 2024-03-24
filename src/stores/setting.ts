import { ref } from 'vue'

import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', () => {
  const settings = ref(<{ [key: string]: any }>{})

  const loadIni = async () => {
    const config = await window.electronAPI.loadIni()
    settings.value = config
  }

  const saveInit = () => {
    return window.electronAPI.saveIni(JSON.stringify(settings.value))
  }

  return { settings, loadIni, saveInit }
})

import { ref } from 'vue'

import { defineStore } from 'pinia'
import { i18n, setI18nLanguage } from '@/i18n'

export const useAppStore = defineStore('app', () => {
  const language = ref('zh-cn')
  const libraryPath = ref(<string[]>[])

  const reload = () => {
    // 从localstorage中初始化
    const storedDataJson = window.localStorage.getItem('app')
    if (storedDataJson) {
      const storedData = JSON.parse(storedDataJson)
      if (storedData) {
        language.value = storedData.language
        libraryPath.value = storedData.libraryPath ? storedData.libraryPath : []
      }
    }
  }

  // 更改语言
  const changeLanguage = (lang: string) => {
    language.value = lang
    setI18nLanguage(i18n, lang)
    store()
  }

  const chooseDirectory = () => {
    window.electronAPI.openDirectory().then((p: string) => {
      if (!libraryPath.value.length) {
        libraryPath.value = [p]
      } else {
        libraryPath.value.push(p)
      }
      window.electronAPI.editLibraryPath()
      store()
    })
  }

  const delLibraryPath = (p: string) => {
    const idx = libraryPath.value.indexOf(p)
    if (idx >= 0) {
      libraryPath.value.splice(idx, 1)
      store()
    }
  }

  // 持久化到localStorage
  const store = () => {
    const jsonStr = JSON.stringify({
      language: language.value,
      libraryPath: libraryPath.value
    })
    window.localStorage.setItem('app', jsonStr)
  }

  reload()

  return {
    language,
    libraryPath,
    changeLanguage,
    chooseDirectory,
    delLibraryPath,
    reload
  }
})

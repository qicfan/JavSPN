import { ref } from 'vue'

import { defineStore } from 'pinia'
import { i18n, setI18nLanguage } from '@/i18n'
import { API } from '@/func'

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
    return new Promise((resolve) => {
      API.openDirectory().then((result) => {
        if (result.data == '') return resolve(1)
        const p = result.data
        if (!libraryPath.value.length) {
          libraryPath.value = [p]
        } else {
          libraryPath.value.push(p)
        }
        // 持久化
        store()
        // 通知主进程：媒体库路径有变化，主进程会通知其他子窗口进行更新
        API.editLibraryPath()
        return resolve(1)
      })
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

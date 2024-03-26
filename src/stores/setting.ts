import { ref } from 'vue'

import { defineStore } from 'pinia'
import { API, RESULT_CODE } from '@/func'
import { i18n } from '@/i18n'

export const useSettingStore = defineStore('setting', () => {
  const settings = ref(<{ [key: string]: any }>{})

  const loadIni = () => {
    return new Promise((resolve, reject) => {
      API.loadIni().then((result) => {
        if (result.errCode == RESULT_CODE.ERROR) {
          return reject(result.errMsg)
        }
        if (result.errCode == RESULT_CODE.NOT_FOUND) {
          return reject(i18n.global.t('SettingFileNotFound'))
        }
        settings.value = JSON.parse(result.data)
        return resolve(1)
      })
    })
  }

  const saveInit = () => {
    return new Promise((resolve, reject) => {
      API.saveIni(JSON.stringify(settings.value)).then((result) => {
        if (result.errCode == RESULT_CODE.ERROR) {
          return reject(result.errMsg)
        }
        return resolve(1)
      })
    })
  }

  return { settings, loadIni, saveInit }
})

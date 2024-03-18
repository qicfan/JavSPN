import { ref } from 'vue'

import { defineStore } from 'pinia'
import defaultSetting from '@/setttings'
import { i18n, setI18nLanguage } from '@/i18n'

export const useAppStore = defineStore('app', () => {
  const language = ref(defaultSetting.language)

  const elementPlusLocale = ref()

  // 更改语言
  function changeLanguage(lang: string) {
    language.value = lang
    setI18nLanguage(i18n, lang)

     /* @vite-ignore */
    import(`element-plus/dist/locale/${language.value}.mjs`).then( m => {
        elementPlusLocale.value = m
    })
  }

  return { language, changeLanguage, elementPlusLocale}
})

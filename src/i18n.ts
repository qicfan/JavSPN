import { nextTick } from 'vue'
import { createI18n, type I18n } from 'vue-i18n'
import defaultSetting from './setttings'

const SUPPORT_LOCALES = ['en', 'zh-cn']

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: defaultSetting.language
})

function setI18nLanguage(i18n: I18n, locale: string) {
    i18n.global.locale = locale
    loadLocaleMessages(i18n, locale)
}

async function loadLocaleMessages(i18n: I18n, locale: string) {
  // load locale messages with dynamic import
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`
  )

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default)

  return nextTick()
}

export  {i18n, setI18nLanguage, SUPPORT_LOCALES}
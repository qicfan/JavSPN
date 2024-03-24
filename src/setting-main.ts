import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Setting from './views/SettingView.vue'
import router from './router/setting'
import { i18n } from './i18n'
import { useAppStore } from './stores/app'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(Setting)
app.use(createPinia())
app.use(ElementPlus)
app.use(router)
const appStore = useAppStore()
appStore.changeLanguage(appStore.language)
app.use(i18n)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')

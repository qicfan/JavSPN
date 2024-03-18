import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import { useAppStore } from './stores/app'

const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)
app.use(router)
const appStore = useAppStore()
appStore.changeLanguage(appStore.language)
app.use(i18n)

app.mount('#app')

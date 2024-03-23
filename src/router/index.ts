import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SettingView from '../views/SettingView.vue'
import Library from '../views/settings/library.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/setting',
      name: 'setting',
      component: SettingView,
      meta: {
        title: 'Setting'
      },
      children: [
        {
          path: 'library',
          component: Library
        }
      ]
    }
  ]
})

export default router

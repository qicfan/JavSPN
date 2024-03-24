import { createRouter, createWebHashHistory } from 'vue-router'
import Library from '../views/settings/library.vue'
import Network from '@/views/settings/network.vue'
import File from '@/views/settings/file.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // 这是一个默认路由，当上面的路由都不匹配时，会进入这里
      redirect: '/library' // 重定向到home页面
    },
    {
      path: '/library',
      component: Library
    },
    {
      path: '/network',
      component: Network
    },
    {
      path: '/file',
      component: File
    }
  ]
})

export default router

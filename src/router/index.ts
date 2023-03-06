import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/Home' },
    {
      path: '/Home',
      name: 'Home',
      meta: { title: '主页' },
      component: () => import('@/components/Layout/index.vue')
    },
    {
      path: '/cardEntry',
      name: 'cardEntry',
      meta: { title: '车辆入场' },
      component: () => import('@/components/Layout/index.vue')
    },
    {
      path: '/cardLeave',
      name: 'cardLeave',
      meta: { title: '车辆离场' },
      component: () => import('@/components/Layout/index.vue')
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('@/views/Login-Register/Login.vue')
    }
  ]
})

export default router

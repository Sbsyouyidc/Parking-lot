import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/Home' },
    { path: '/Home', name: 'Home', meta: { title: '主页' } },
    { path: '/cardEntry', name: 'cardEntry', meta: { title: '车辆入场' } },
    { path: '/cardLeave', name: 'cardLeave', meta: { title: '车辆离场' } }
  ]
})

export default router

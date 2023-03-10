import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/Home' },
    {
      path: '/Home',
      name: 'Home',
      meta: { title: '主页' },
      component: () => import('@/components/Layout/index.vue'),
      children: [
        {
          path: '/cardEntry',
          name: 'cardEntry',
          meta: { title: '车辆入场' },
          components: { cardEntry: () => import('@/views/cardEnter/index.vue') }
        },
        {
          path: '/cardLeave',
          name: 'cardLeave',
          meta: { title: '车辆离场' },
          components: { cardLeave: () => import('@/views/cardLeave/index.vue') }
        }
      ]
    },

    {
      path: '/Register',
      name: 'Register',
      component: () => import('@/views/LoginRegister/Register.vue')
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('@/views/LoginRegister/Login.vue')
    }
  ]
})

export default router

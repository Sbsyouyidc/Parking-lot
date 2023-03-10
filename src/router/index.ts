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
          path: '/cardAccess',
          name: 'cardAccess',
          meta: { title: '车辆入场' },
          component: () => import('@/views/cardEnter/index.vue')
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

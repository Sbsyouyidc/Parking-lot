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
          meta: { title: '车辆出入' },
          component: () => import('@/views/cardAccess/index.vue')
        },
        {
          path: '/orderRecord',
          name: 'orderRecord',
          meta: { title: '订单记录' },
          component: () => import('@/views/orderRecord/index.vue')
        },
        {
          path: '/chargeStandard',
          name: 'chargeStandard',
          meta: { title: '收费标准' },
          component: () => import('@/views/chargeStandard/index.vue')
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

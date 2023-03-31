import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: 'Home' },
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
        },
        {
          path: '/ParkingManagement',
          name: 'ParkingManagement',
          meta: { title: '车位管理' },
          component: () => import('@/views/ParkingManagement/index.vue')
        },
        {
          path: '/UserManagement',
          name: 'UserManagement',
          meta: { title: '用户管理' },
          component: () => import('@/views/userManagement/index.vue')
        },
        {
          path: '/ParkingInquiry',
          name: 'ParkingInquiry',
          meta: { title: '车位查询' },
          component: () => import('@/views/parkingInquiry/index.vue')
        },
        {
          path: '/FeeDetails',
          name: 'FeeDetails',
          meta: { title: '收费明细' },
          component: () => import('@/views/feeDetails/index.vue')
        }
      ]
    },
    {
      path: '/userMain',
      name: 'userMain',
      component: () => import('@/views/userMain/index.vue'),
      children: [
        {
          path: '/userCardAccess',
          name: 'userCardAccess',
          meta: { title: '车辆出入' },
          component: () => import('@/views/cardAccess/index.vue')
        },
        {
          path: '/userFeeDetails',
          name: 'userFeeDetails',
          meta: { title: '收费明细' },
          component: () => import('@/views/feeDetails/index.vue')
        },
        {
          path: '/userOrderRecord',
          name: 'userOrderRecord',
          meta: { title: '订单记录' },
          component: () => import('@/views/userMain/userOrderRecord.vue')
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

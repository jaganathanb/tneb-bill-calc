import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from 'vuefire'

import { useFeedbackStore } from '@/stores'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: () => import('../views/private-layout.vue'),
      children: [
        {
          path: '',
          redirect: '/home'
        },
        {
          path: 'home',
          component: () => import('../views/home.vue')
        },
        {
          path: 'bills',
          component: () => import('../views/bill/bills.vue')
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/auth',
      component: () => import('../views/account/public-layout.vue'),
      children: [
        {
          path: '',
          redirect: 'auth/login'
        },
        {
          path: 'login',
          component: () => import('../views/account/login.vue')
        },
        {
          path: 'register',
          component: () => import('../views/account/register.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to, _from, next) => {
  // clear alert on route change
  const alertStore = useFeedbackStore()

  alertStore.clearAlert()

  const currentUser = await getCurrentUser()

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (currentUser) {
      next()
    } else {
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

import { createRouter, createWebHistory } from 'vue-router'

import { useAlertStore, useAuthStore } from '@/stores'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: () => import('../views/Layout.vue'),
      children: [
        {
          path: '',
          alias: 'users',
          component: () => import('../views/users/List.vue')
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/auth',
      component: () => import('../views/account/Layout.vue'),
      children: [
        {
          path: '',
          redirect: 'auth/login'
        },
        {
          path: 'login',
          component: () => import('../views/account/Login.vue')
        },
        {
          path: 'register',
          component: () => import('../views/account/Register.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to, _from, next) => {
  // clear alert on route change
  const alertStore = useAlertStore()
  alertStore.clear()

  const authStore = useAuthStore()

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

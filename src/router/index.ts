import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from 'vuefire'
import { Grid, Tickets } from '@element-plus/icons-vue'

import { useFeedbackStore } from '@/stores'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: () => import('../views/private-layout.vue'),
      name: 'private',
      children: [
        {
          path: '',
          name: 'dashboard-rd',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          component: () => import('../views/home.vue'),
          name: 'dashboard',
          meta: {
            label: 'Dashboard',
            icon: Grid
          }
        },
        {
          path: 'bills',
          name: 'bills',
          component: () => import('../views/bill/bills.vue'),
          meta: {
            label: 'Bills',
            icon: Tickets
          }
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/auth',
      component: () => import('../views/account/public-layout.vue'),
      name: 'public',
      children: [
        {
          path: '',
          name: 'auth-rd',
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

import { Grid, Setting, Tickets } from '@element-plus/icons-vue'
import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores'

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
          component: () => import('../views/dashboard/layout.vue'),
          name: 'dashboard',
          meta: {
            label: 'Dashboard',
            icon: Grid
          }
        },
        {
          path: 'gsts',
          name: 'gsts',
          component: () => import('../views/gst/gsts.vue'),
          meta: {
            label: 'GSTs',
            icon: Tickets
          }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/settings/layout.vue'),
          meta: {
            label: 'Settings',
            icon: Setting
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
  const { isAuthenticated } = storeToRefs(useAuthStore())

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isAuthenticated.value) {
      next()
    } else {
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    if (to.path === '/auth/login' && isAuthenticated) {
      next({
        path: to.query.redirect?.toString()
      })
    } else {
      next()
    }
  }
})

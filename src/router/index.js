import {
  createRouter,
  createWebHistory
} from 'vue-router'
// import HomeView from '../views/HomeView.vue'

import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
      path: '/account/login',
      name: 'login',
      hidden: true,
      component: () => import('@/views/account/login.vue'),
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [{
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard.vue'),
          meta: {
            title: 'Dashboard',
            icon: 'dashboard',
            keepAlive: false
          }
        },
        {
          path: '/about',
          name: 'About',
          meta: {
            title: 'about',
            icon: 'about'
          },
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('@/views/AboutView.vue'),
        },
      ]
    },

  ],
})

export const resetRouter = () => {
  console.log(router)
}

export default router

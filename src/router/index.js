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
          keepAlive: true
        }
      }, ]
    },
    {
      path: '/about',
      component: Layout,
      children: [{
        path: 'about',
        name: 'About',
        component: () => import('@/views/AboutView.vue'),
        meta: {
          title: 'About',
          icon: 'about',
          keepAlive: true
        }
      }, ]
    },
    {
      path: '/example',
      component: Layout,
      redirect: '/example/table',
      meta: {
        title: 'Example',
        // icon: 'el-icon-s-help'
        icon: 'example'
      },
      children: [{
          path: 'table',
          name: 'Table',
          component: () => import('@/views/table.vue'),
          meta: {
            title: 'Table',
            icon: 'table',
          }
        },
        {
          path: '/tree',
          name: 'Tree',
          meta: {
            title: 'Tree',
            icon: 'tree'
          },
          component: () => import('@/views/tree.vue'),
        },
      ]
    },

  ],
})

export const resetRouter = () => {
  console.log(router)
}

export default router

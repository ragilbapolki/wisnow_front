import {
  createRouter,
  createWebHistory
  // createWebHashHistory
} from 'vue-router'
// import HomeView from '../views/HomeView.vue'

import nestedRouter from './modules/nested'

import Layout from '@/layout/index.vue'
import {
  HelpFilled,
  Menu,
  Clock
} from '@element-plus/icons-vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
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
          keepAlive: true,
          affix: true
        }
      }, ]
    },
    {
      path: '/about',
      component: Layout,
      redirect: '/about/test',
      meta: {
        alwaysShow: true,
        title: 'About',
        icon: HelpFilled
      },
      children: [{
        path: 'index',
        name: 'Test',
        component: () => import('@/views/about/test.vue'),
        meta: {
          title: 'Test',
        }
      }, {
        path: 'readme',
        name: 'Readme',
        component: () => import('@/views/about/readme.vue'),
        meta: {
          title: 'Readme',
        }
      }, {
        path: 'changelog',
        name: 'Changelog',
        component: () => import('@/views/about/changelog.vue'),
        meta: {
          title: 'Changelog',
        }
      }]
    },
    {
      path: '/example',
      component: Layout,
      redirect: '/example/table',
      meta: {
        alwaysShow: true,
        title: 'Example',
        icon: Menu
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
          path: 'tree',
          name: 'Tree',
          meta: {
            title: 'Tree',
            icon: 'tree'
          },
          component: () => import('@/views/tree.vue'),
        },
      ]
    },
    {
      path: '/form',
      component: Layout,
      children: [{
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form.vue'),
        meta: {
          title: 'Form',
          icon: 'form'
        }
      }]
    },
    nestedRouter,
    {
      path: '/external-link',
      component: Layout,
      children: [{
        path: 'https://github.com/chocho-1115/vue-admin',
        meta: {
          title: 'External Link',
          icon: 'link'
        }
      }]
    },
    {
      path: '/404',
      component: () => import('@/views/404.vue'),
      hidden: true
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
      hidden: true
    },
  ],
})

export const resetRouter = () => {
  console.log(router)
}

export default router

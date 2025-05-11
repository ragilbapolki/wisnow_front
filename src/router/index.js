import {
  createRouter,
  createWebHistory
} from 'vue-router'
// import HomeView from '../views/HomeView.vue'

import Layout from '@/layout/index.vue'
import {
  HelpFilled,
  Menu,
} from '@element-plus/icons-vue'

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
          icon: HelpFilled,
          keepAlive: true
        }
      }, ]
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
    {
      path: '/nested',
      component: Layout,
      redirect: '/nested/menu1',
      name: 'Nested',
      meta: {
        title: 'Nested',
        icon: 'nested'
      },
      children: [{
          path: 'menu1',
          component: () => import('@/views/nested/menu1/index.vue'), // Parent router-view
          name: 'Menu1',
          meta: {
            title: 'Menu1'
          },
          children: [{
              path: 'menu1-1',
              component: () => import('@/views/nested/menu1/menu1-1.vue'),
              name: 'Menu1-1',
              meta: {
                title: 'Menu1-1'
              }
            },
            {
              path: 'menu1-2',
              component: () => import('@/views/nested/menu1/menu1-2/index.vue'),
              name: 'Menu1-2',
              meta: {
                title: 'Menu1-2'
              },
              children: [{
                  path: 'menu1-2-1',
                  component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1.vue'),
                  name: 'Menu1-2-1',
                  meta: {
                    title: 'Menu1-2-1'
                  }
                },
                {
                  path: 'menu1-2-2',
                  component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2.vue'),
                  name: 'Menu1-2-2',
                  meta: {
                    title: 'Menu1-2-2'
                  }
                }
              ]
            },
          ]
        },
        {
          path: 'menu2',
          component: () => import('@/views/nested/menu2.vue'),
          name: 'Menu2',
          meta: {
            title: 'menu2'
          }
        }
      ]
    },
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

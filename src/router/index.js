// index.js
import {
  createRouter,
  createWebHistory
} from 'vue-router'

import nestedRouter from './modules/nested'
import Home from '@/views/Home.vue'
import ArticleDetail from '@/views/ArticleDetail.vue'
import ArticleList from '@/views/ArticleList.vue'

import Layout from '@/layout/index.vue'
import {
  DocumentCopy,
  Grid,
  HelpFilled,
  Menu,
  Odometer,
  Picture
} from '@element-plus/icons-vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '/account/login',
      name: 'login',
      hidden: true,
      component: () => import('@/views/account/login.vue'),
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home',
        requiresAuth: false
      }
    },
    {
      path: '/articlesList',
      name: 'PublicArticleList',
      component: ArticleList
    },
    {
      path: '/articles/:slug',
      name: 'ArticleDetail',
      component: ArticleDetail,
      props: true
    },
    {
      path: '/admin',
      component: Layout,
      redirect: '/admin/dashboard',
      meta: {
        requiresAuth: true
      },
      children: [{
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard.vue'),
        meta: {
          title: 'Dashboard',
          icon: 'dashboard',
          keepAlive: true,
          affix: true,
          requiresAuth: true
        }
      }]
    },
    {
      path: '/about',
      component: Layout,
      redirect: '/about/readme',
      meta: {
        alwaysShow: true,
        title: 'About',
        icon: HelpFilled
      },
      children: [{
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
      redirect: '/example/icon',
      meta: {
        alwaysShow: true,
        title: 'Example',
        icon: Menu
      },
      children: [{
          path: 'icon',
          name: 'Icons',
          component: () => import('@/views/example/icon.vue'),
          meta: {
            title: 'Icons',
            icon: 'icon',
          }
        },
        {
          path: 'table',
          name: 'Table',
          component: () => import('@/views/example/table.vue'),
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
          component: () => import('@/views/example/tree.vue'),
        },
        {
          path: 'form',
          name: 'Form',
          meta: {
            title: 'Form',
            icon: 'form'
          },
          component: () => import('@/views/example/form.vue'),
        },
        {
          path: 'test',
          name: 'Test',
          component: () => import('@/views/example/test.vue'),
          meta: {
            title: 'Test',
            icon: Odometer,
            keepAlive: true,
          }
        },
      ]
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
    // Categories Management
    {
      path: '/admin/categories',
      component: Layout,
      redirect: '/admin/categories/list',
      meta: {
        title: 'Categories',
        icon: Grid
      },
      children: [
        {
          path: 'list',
          name: 'CategoryList',
          component: () => import('@/views/category/index.vue'),
          meta: {
            title: 'Category List',
            icon: Grid,
            breadcrumb: [
              { title: 'Categories', to: '/admin/categories/list' },
              { title: 'List' }
            ]
          }
        },
      ]
    },
    // Articles Management
    {
      path: '/admin/articles',
      component: Layout,
      redirect: '/admin/articles/list',
      meta: {
        title: 'Articles',
        icon: DocumentCopy
      },
      children: [
        {
          path: 'list',
          name: 'ArticleList',
          component: () => import('@/views/article/ArticleList.vue'),
          meta: {
            title: 'Article List',
            icon: DocumentCopy,
            breadcrumb: [
              { title: 'Articles', to: '/admin/articles/list' },
              { title: 'List' }
            ]
          }
        },
        {
          path: 'create',
          name: 'ArticleCreate',
          component: () => import('@/views/article/ArticleForm.vue'),
          hidden: true,
          meta: {
            title: 'Create Article',
            breadcrumb: [
              { title: 'Articles', to: '/admin/articles/list' },
              { title: 'Create' }
            ]
          }
        },
        {
          path: 'edit/:id',
          name: 'ArticleEdit',
          component: () => import('@/views/article/ArticleForm.vue'),
          hidden: true,
          meta: {
            title: 'Edit Article',
            breadcrumb: [
              { title: 'Articles', to: '/admin/articles/list' },
              { title: 'Edit' }
            ]
          }
        },
        {
          path: 'view/:id',
          name: 'ArticleView',
          component: () => import('@/views/article/ArticleView.vue'),
          hidden: true,
          meta: {
            title: 'View Article',
            breadcrumb: [
              { title: 'Articles', to: '/admin/articles/list' },
              { title: 'View' }
            ]
          }
        },
        {
          path: ':id/gallery',
          name: 'ArticleGallery',
          component: () => import('@/views/article/ArticleGallery.vue'),
          hidden: true,
          meta: {
            title: 'Article Gallery',
            icon: Picture,
            breadcrumb: [
              { title: 'Articles', to: '/admin/articles/list' },
              { title: 'Gallery' }
            ]
          }
        }
      ]
    },
    // 404 Error Page
    {
      path: '/404',
      component: () => import('@/views/404.vue'),
      hidden: true
    },
    // Catch all 404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
      hidden: true
    },
  ],
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  // Set page title
  if (to.meta?.title) {
    document.title = `${to.meta.title} - Admin Panel`
  }

  next()
})

router.afterEach((to, from) => {
  // Remove loading state
})

export const resetRouter = () => {
  console.log(router)
}

export default router

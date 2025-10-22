// index.js
import {
  createRouter,
  createWebHistory
} from 'vue-router'
import { ElMessage } from 'element-plus'

import nestedRouter from './modules/nested'
import Home from '@/views/Home.vue'
import ArticleDetail from '@/views/ArticleDetail.vue'
import ArticleList from '@/views/ArticleList.vue'

import Layout from '@/layout/index.vue'
import {
  DataAnalysis,
  DocumentCopy,
  Grid,
  HelpFilled,
  Menu,
  Odometer,
  OfficeBuilding,
  Picture,
  User
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
      hidden: true,
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
        requiresAuth: true,
      },
      children: [{
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard.vue'),
        meta: {
          title: 'Dashboard',
          icon: DataAnalysis,
          keepAlive: true,
          affix: true,
          requiresAuth: true,
        }
      }]
    },
    {
      path: '/about',
      component: Layout,
      redirect: '/about/readme',
      hidden: true,
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
      hidden: true,
      redirect: '/example/icon',
      meta: {
        alwaysShow: true,
        title: 'Example',
        icon: Menu,
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
    {
      path: '/external-link',
      hidden: true,
      component: Layout,
      children: [{
        path: 'https://github.com/chocho-1115/vue-admin',
        meta: {
          title: 'External Link',
          icon: 'link'
        }
      }]
    },
    // Categories Management - ADMIN ONLY
    {
      path: '/admin/categories',
      component: Layout,
      redirect: '/admin/categories/list',
      meta: {
        title: 'Categories',
        icon: Grid,
        requiresAuth: true,
      },
      children: [
        {
          path: 'list',
          name: 'CategoryList',
          component: () => import('@/views/category/index.vue'),
          meta: {
            title: 'Kategori',
            icon: Grid,
            breadcrumb: [
              { title: 'Categories', to: '/admin/categories/list' },
              { title: 'List' }
            ]
          }
        },
      ]
    },
    // Division Management - ADMIN ONLY
    {
      path: '/admin/divisi',
      component: Layout,
      redirect: '/admin/divisi/list',
      meta: {
        title: 'Division',
        icon: OfficeBuilding, // ✅ Gunakan icon yang sudah di-import
        requiresAuth: true,
      },
      children: [
        {
          path: 'list',
          name: 'DivisionList',
          component: () => import('@/views/division/DivisionManagement.vue'),
          meta: {
            title: 'Divisi / Departemen',
            icon: OfficeBuilding,
            breadcrumb: [
              { title: 'Divisi', to: '/admin/division/list' },
              { title: 'List' }
            ]
          }
        },
      ]
    },
    // Profile - All authenticated users
    {
      path: '/profile',
      component: Layout,
      redirect: '/profile/me',
      meta: {
        title: 'Profile',
        requiresAuth: true
      },
      hidden: true,
      children: [
        {
          path: 'me',
          name: 'MyProfile',
          component: () => import('@/views/Profile/MyProfile.vue'),
          meta: {
            title: 'My Profile',
            requiresAuth: true
          }
        },
      ]
    },
    // Users Management - ADMIN ONLY
    {
      path: '/admin/users',
      component: Layout,
      redirect: '/admin/users/list',
      meta: {
        title: 'Users',
        icon: User,
        requiresAuth: true,
      },
      children: [
        {
          path: 'list',
          name: 'UserList',
          component: () => import('@/views/user/userList.vue'),
          meta: {
            title: 'Users',
            icon: User,
            requiresAuth: true,
            breadcrumb: [
              { title: 'Users', to: '/admin/users/list' },
              { title: 'List' }
            ]
          }
        }
      ]
    },
    // Articles Management - ADMIN & EDITOR
    {
      path: '/admin/articles',
      component: Layout,
      redirect: '/admin/articles/list',
      meta: {
        title: 'Articles',
        icon: DocumentCopy,
        requiresAuth: true,
      },
      children: [
        {
          path: 'list',
          name: 'AdminArticleList',
          component: () => import('@/views/article/ArticleList.vue'),
          meta: {
            title: 'Article List',
            icon: DocumentCopy,
            requiresAuth: true,
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
            requiresAuth: true,
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
            requiresAuth: true,
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
            requiresAuth: true,
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
            requiresAuth: true,
            breadcrumb: [
              { title: 'Articles', to: '/admin/articles/list' },
              { title: 'Gallery' }
            ]
          }
        },
      ]
    },
    // 404 Error Page
    {
      path: '/404',
      component: () => import('@/views/404.vue'),
      hidden: true
    },
    // 403 Forbidden Page
    {
      path: '/403',
      component: () => import('@/views/404.vue'),
      hidden: true,
      meta: {
        title: 'Access Denied'
      }
    },
    // Catch all 404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
      hidden: true
    },
  ],
})

// Helper function to check if user has required role
function hasRequiredRole(userRole, requiredRoles) {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true
  }
  return requiredRoles.includes(userRole)
}

router.afterEach((to, from) => {
  // Remove loading state if any
})

export const resetRouter = () => {
  console.log(router)
}

export default router

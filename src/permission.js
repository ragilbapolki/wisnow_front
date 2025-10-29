// permission.js
import router from './router'
import { getInfo } from './api/user'
import { ctx, dispatch } from './store'
import NProgress from 'nprogress'
import { ElMessage } from 'element-plus'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

// Routes that don't require authentication
const whiteList = ['/', '/404', '/403', '/articlesList', '/articles']

// Public routes patterns (routes that start with these paths)
const publicRoutePatterns = ['/articles/', '/author/', '/articlesList']

function hasRequiredRole(userRole, requiredRoles) {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true
  }
  return requiredRoles.includes(userRole)
}

function isPublicRoute(path) {
  // Check if path is in whitelist
  if (whiteList.includes(path)) {
    return true
  }

  // Check if path matches public patterns
  return publicRoutePatterns.some(pattern => path.startsWith(pattern))
}

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = to.meta.title ? `${to.meta.title} - WISMILAK Knowledge Base` : 'WISMILAK Knowledge Base'

  const hasToken = dispatch.user.getToken()
  console.log('🔍 [PERMISSION] Checking route:', to.path)
  console.log('🔍 [PERMISSION] Has token:', !!hasToken)
  console.log('🔍 [PERMISSION] Requires auth:', to.meta?.requiresAuth)

  if (hasToken) {
    // User has token
    if (to.path === '/account/login') {
      next({ path: '/' })
      NProgress.done()
      return
    }

    const hasUserInfo = ctx.userInfo && ctx.userInfo.name

    if (hasUserInfo) {
      // User info already loaded
      const userRole = ctx.userInfo.role
      console.log('✅ [PERMISSION] User info exists:', ctx.userInfo.name, 'Role:', userRole)

      // Check role requirements
      if (to.meta.roles) {
        if (!hasRequiredRole(userRole, to.meta.roles)) {
          console.log('❌ [PERMISSION] Access denied!')
          ElMessage.error(`Akses ditolak. Halaman ini hanya untuk: ${to.meta.roles.join(', ')}`)
          next('/403')
          NProgress.done()
          return
        }
      }

      next()
    } else {
      // Token exists but no user info - fetch it
      console.log('⚠️ [PERMISSION] Token exists but no user info, fetching...')

      try {
        const response = await getInfo(hasToken)
        const user = response.data

        if (!user || !user.id || !user.name) {
          console.error('❌ [PERMISSION] Invalid user data:', user)
          throw new Error('Verification failed, please login again.')
        }

        // Save user info
        dispatch.user.saveInfo(user)
        console.log('✅ [PERMISSION] User info fetched:', user.name, 'Role:', user.role)

        const userRole = user.role

        // Check role requirements
        if (to.meta.roles) {
          if (!hasRequiredRole(userRole, to.meta.roles)) {
            console.log('❌ [PERMISSION] Access denied after fetch!')
            ElMessage.error(`Akses ditolak. Halaman ini hanya untuk: ${to.meta.roles.join(', ')}`)
            next('/403')
            NProgress.done()
            return
          }
        }

        next()
      } catch (error) {
        console.error('❌ [PERMISSION] Error fetching user info:', error)

        // Clear all auth data
        dispatch.user.removeToken()
        dispatch.user.removeInfo()
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        ElMessage.error(error.message || 'Sesi Anda telah berakhir, silakan login kembali')

        // Redirect to home for protected routes
        if (to.meta?.requiresAuth !== false && !isPublicRoute(to.path)) {
          console.log('🔄 [PERMISSION] Redirecting to home because auth failed')
          next({ path: '/', query: { redirect: to.path } })
          NProgress.done()
        } else {
          next()
        }
      }
    }
  } else {
    // No token
    console.log('⚠️ [PERMISSION] No token found')

    // Check if route is public or doesn't require auth
    if (isPublicRoute(to.path) || to.meta?.requiresAuth === false) {
      console.log('✅ [PERMISSION] Public route, allowing access')
      next()
    } else {
      // Protected route without token - redirect to login or home
      console.log('🔄 [PERMISSION] Protected route without token, redirecting...')

      // If it's an admin route, redirect to home
      if (to.path.startsWith('/admin')) {
        ElMessage.warning('Silakan login terlebih dahulu untuk mengakses halaman admin')
        next({ path: '/', query: { redirect: to.path } })
      } else {
        next(`/account/login?redirect=${to.path}`)
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

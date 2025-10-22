// permission.js
import router from './router'
import { getInfo } from './api/user'
import { ctx, dispatch } from './store'
import NProgress from 'nprogress'
import { ElMessage } from 'element-plus'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ['/account/login', '/404', '/403', '/', '/articlesList']

function hasRequiredRole(userRole, requiredRoles) {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true
  }
  return requiredRoles.includes(userRole)
}

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = to.meta.title ? `${to.meta.title} - WISMILAK Knowledge Base` : 'WISMILAK Knowledge Base'

  const hasToken = dispatch.user.getToken()

  if (hasToken) {
    if (to.path === '/account/login') {
      next({ path: '/' })
      NProgress.done()
      return
    }

    const hasUserInfo = ctx.userInfo && ctx.userInfo.name

    if (hasUserInfo) {
      const userRole = ctx.userInfo.role

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

      try {
        const response = await getInfo(hasToken)
        const user = response.data


        if (!user || !user.id || !user.name) {
          console.error('❌ [PERMISSION] Invalid user data:', user)
          throw new Error('Verification failed, please login again.')
        }

        // ✅ PENTING: Simpan user info termasuk role
        dispatch.user.saveInfo(user)


        const userRole = user.role

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
        console.error('❌ [PERMISSION] Error:', error)

        dispatch.user.removeToken()
        dispatch.user.removeInfo()

        ElMessage.error(error.message || 'Terjadi kesalahan, silakan login kembali')

        if (!whiteList.includes(to.path)) {
          next(`/account/login?redirect=${to.path}`)
          NProgress.done()
        } else {
          next()
        }
      }
    }
  } else {
    console.log('⚠️ [PERMISSION] No token found')

    if (whiteList.includes(to.path)) {
      next()
    } else if (to.meta?.requiresAuth === false) {
      next()
    } else {
      next(`/account/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

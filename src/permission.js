// permission.js
import router from './router'
import { getInfo } from './api/user'
import { ctx, dispatch } from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

// ✅ Halaman yang bisa diakses tanpa login
const whiteList = ['/account/login', '/404', '/'] // Tambahkan '/' untuk home page

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = to.meta.title ? `${to.meta.title} - Vue Admin` : 'Vue Admin'

  const hasToken = dispatch.user.getToken()

  if (hasToken) {
    // ✅ Jika sudah login dan mengakses halaman login, redirect ke home (bukan dashboard)
    if (to.path === '/account/login') {
      next({ path: '/' }) // Redirect ke home, bukan dashboard
      NProgress.done()
    } else {
      const hasUserInfo = ctx.userInfo && ctx.userInfo.name

      if (hasUserInfo) {
        next()
      } else {
        try {
          const response = await getInfo(hasToken)
          const user = response.data

          console.log('Extracted user:', user)

          if (!user || !user.id || !user.name) {
            console.error('Invalid user data:', user)
            throw new Error('Verification failed, please login again.')
          }

          console.log('Valid user info:', user)

          // ✅ Simpan info user
          dispatch.user.saveInfo(user)

          next()
        } catch (error) {
          console.error('Permission error:', error)

          dispatch.user.removeToken()
          console.error(error.message || 'Has Error')

          if (!whiteList.includes(to.path)) {
            next(`/account/login?redirect=${to.path}`)
            NProgress.done()
          } else {
            next()
          }
        }
      }
    }
  } else {
    // ✅ Jika belum login, cek apakah halaman butuh auth
    if (!whiteList.includes(to.path) && to.meta?.requiresAuth !== false) {
      next(`/account/login?redirect=${to.path}`)
      NProgress.done()
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

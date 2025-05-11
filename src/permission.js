import router from './router'
import {
  getInfo
} from './api/user'
import {
  ctx,
  dispatch
} from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import {
//   getToken,
//   removeToken
// } from './store/user'

NProgress.configure({
  showSpinner: false,
})

// no redirect whitelist
const whiteList = [
  '/account/login',
  '/404'
]

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = to.meta.title ? `${to.meta.title} - Vue Admin` : `Vue Admin`

  // determine whether the user has logged in
  const hasToken = dispatch.user.getToken()

  if (hasToken) {

    if (to.path === '/account/login') {
      // if is logged in, redirect to the home page
      next({
        path: '/',
      })
      NProgress.done()
    } else {
      const hasUserInfo = ctx.userInfo.name

      if (hasUserInfo) {
        next()
      } else {
        try {
          // get user info
          const {
            body
          } = await getInfo(hasToken)
          if (!body) {
            throw new Error("Verification failed, please Login again.");
          }
          dispatch.user.saveInfo(body)
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          dispatch.user.removeToken()
          ElMessage.error(error || 'Has Error')
          next(`/account/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/account/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

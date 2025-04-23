import router from './router'
import {
  getInfo
} from './api/user'
import ctx from './utils/context'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  getToken,
  removeToken
} from './utils/auth'

NProgress.configure({
  showSpinner: false,
})

// no redirect whitelist
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = `${to.meta.title} - Vue Admin`

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({
        path: '/',
      })
      NProgress.done()
    } else {
      const hasUserInfo = ctx.userInfo
      if (hasUserInfo) {
        next()
      } else {
        try {
          // get user info
          const {
            data
          } = await getInfo(hasToken)

          if (!data) {
            // return reject('Verification failed, please Login again.')
            throw new Error("Verification failed, please Login again.");
          }

          const {
            name,
            avatar
          } = data

          console.log(name, avatar, data)

          // commit('SET_NAME', name)
          // commit('SET_AVATAR', avatar)

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          removeToken()
          ElMessage.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
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
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

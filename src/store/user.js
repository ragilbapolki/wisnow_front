import {
  getToken,
  setToken,
  removeToken
} from './storage'
import {
  resetRouter
} from '@/router'

import context from './context'

export default {
  getToken,
  setToken,
  removeToken,

  removeInfo() {
    removeToken() // must remove  token  first
    resetRouter() // 防止后退上一页跳到需要登录的页面
    context.userInfo = {}
  },

  saveInfo(data) {
    context.userInfo = data
  },

}


// removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()

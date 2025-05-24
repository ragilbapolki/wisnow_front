import {
  getToken,
  setToken,
  removeToken
} from '../storage'
import {
  resetRouter
} from '@/router'

export const state = {
  // name: '',
  // avatar: ''
}
export const dispatch = {
  getToken,
  setToken,
  removeToken,

  removeInfo() {
    removeToken() // must remove  token  first
    resetRouter() // 防止后退上一页跳到需要登录的页面
    Object.keys(state).forEach(key => delete state[key]);

  },

  saveInfo(data) {
    Object.assign(state, data)
  },

}

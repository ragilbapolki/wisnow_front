import {
  reactive,
} from 'vue'

import {
  state as userState
} from './modules/user'

import {
  state as sidebarState
} from './modules/sidebar'

import {
  state as tagsViewState
} from './modules/tagsView'

export default reactive({
  device: 'desktop',
  userInfo: userState,
  sidebar: sidebarState,
  tagsView: tagsViewState,
})

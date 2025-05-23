import {
  reactive,
} from 'vue'


import {
  state as userState
} from './modules/user'

import {
  state as sidebarState
} from './modules/sidebar'

export default reactive({
  userInfo: userState,
  sidebar: sidebarState,
  device: 'desktop',
})

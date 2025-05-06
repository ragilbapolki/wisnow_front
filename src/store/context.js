import {
  reactive,
} from 'vue'
import {
  getSidebarStatus
} from './storage'

export default reactive({
  userInfo: {
    name: '',
    avatar: ''
  },
  sidebar: {
    opened: getSidebarStatus(),
    withoutAnimation: false
  },
  device: 'desktop',

})

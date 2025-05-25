import {
  reactive,
} from 'vue'

import userInfo from './user'

import sidebar from './sidebar'

export default reactive({
  device: 'desktop',
  userInfo,
  sidebar,
})

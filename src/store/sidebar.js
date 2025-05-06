import {
  setSidebarStatus
} from './storage'

import ctx from './context.js'

export default {
  close({
    withoutAnimation
  }) {
    ctx.sidebar.opened = false
    ctx.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus(0)
  },
  toggle() {
    ctx.sidebar.opened = !ctx.sidebar.opened
    ctx.sidebar.withoutAnimation = false
    setSidebarStatus(ctx.sidebar.opened ? 1 : 0)
  },
}

import {
  setSidebarStatus,
  getSidebarStatus
} from '../storage'

export const state = {
  opened: getSidebarStatus(),
  withoutAnimation: false
}

export const dispatch = {
  close({
    withoutAnimation
  }) {
    state.opened = false
    state.withoutAnimation = withoutAnimation
    setSidebarStatus(0)
  },
  toggle() {
    state.opened = !state.opened
    state.withoutAnimation = false
    setSidebarStatus(state.opened ? 1 : 0)
  },
}

import context from './context'
import staticContext from './static'
import {
  dispatch as sidebarDispatch
} from './modules/sidebar'
import {
  dispatch as userDispatch
} from './modules/user'

export const dispatch = {
  sidebar: sidebarDispatch,
  user: userDispatch
}

export const ctx = context

export const sctx = staticContext

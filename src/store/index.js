import context from './context'
import staticContext from './static'
import {
  dispatch as userDispatch
} from './modules/user'
import {
  dispatch as sidebarDispatch
} from './modules/sidebar'

export const dispatch = {
  user: userDispatch,
  sidebar: sidebarDispatch,
}

export const ctx = context

export const sctx = staticContext

import context from './context'
import staticContext from './static'
import {
  dispatch as userDispatch
} from './modules/user'
import {
  dispatch as sidebarDispatch
} from './modules/sidebar'
import {
  dispatch as tagsViewDispatch
} from './modules/tagsView'

export const dispatch = {
  user: userDispatch,
  sidebar: sidebarDispatch,
  tagsView: tagsViewDispatch,
}

export const ctx = context

export const sctx = staticContext

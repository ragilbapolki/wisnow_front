import context from './context'
import staticContext from './static'
import sidebar from './sidebar'
import user from './user'

export const dispatch = {
  sidebar,
  user
}

export const ctx = context

export const sctx = staticContext

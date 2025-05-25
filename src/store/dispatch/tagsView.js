import ctx from '../context'

const state = ctx.tagsView

export default {
  add(view) {
    if (state.some(v => v.path === view.path)) return
    state.push(
      Object.assign({}, view, {
        title: view.meta?.title || 'no-name'
      })
    )
  },
  // visitedViews
  remove(view) {
    for (const [i, v] of state.entries()) {
      if (v.path === view.path) {
        state.splice(i, 1)
        break
      }
    }
  },
  update(view) {
    for (let v of state) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

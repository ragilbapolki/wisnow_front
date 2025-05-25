import ctx from '../context'

export const state = []

export const dispatch = {
  add(ps, view) {

    // console.log(ps, ctx.tagsView)

    const state = ctx.tagsView


    if (state.some(v => v.path === view.path)) return
    state.push(
      Object.assign({}, view, {
        title: view.meta?.title || 'no-name'
      })
    )
    // console.log(state)
  }

}

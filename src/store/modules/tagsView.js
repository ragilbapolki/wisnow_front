export const state = []

export const dispatch = {
  add(view) {
    if (state.some(v => v.path === view.path)) return
    state.push(
      Object.assign({}, view, {
        title: view.meta?.title || 'no-name'
      })
    )
    console.log(state)
  }

}

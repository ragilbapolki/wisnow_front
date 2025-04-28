import 'normalize.css/normalize.css' // CSS resets
import '@/styles/main.scss' // global css
// import 'element-plus/theme-chalk/dark/css-vars.css'

import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router'

import SvgIcon from '@/components/SvgIcon.vue'

async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return
  }

  const {
    worker
  } = await import('../mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    serviceWorker: {
      url: '../mockServiceWorker.js',
    },
  })
}

enableMocking().then(async () => {
  await import('@/permission')

  const app = createApp(App)

  app.use(router)
  app.component('svg-icon', SvgIcon)

  app.mount('#app')
})

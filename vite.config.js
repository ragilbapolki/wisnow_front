// import path from 'path'

import {
  fileURLToPath,
  URL
} from 'node:url'

import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {
  ElementPlusResolver
} from 'unplugin-vue-components/resolvers'
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'

// const __dirname = path.resolve()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VitePluginSvgSpritemap('./src/icons/svg/*.svg', { //  // 暂未接入svgo
      injectSvgOnDev: true,
    }),
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})

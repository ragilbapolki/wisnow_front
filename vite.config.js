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

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'

// const __dirname = path.resolve()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // svg 雪碧图
    VitePluginSvgSpritemap('./src/icons/svg/*.svg', {
      // injectSvgOnDev: true,
    }),
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [
        // 自动导入 element plus 相关函数 如ElMessage
        ElementPlusResolver(),
        // Auto import icon components
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon'
        })
      ],

    }),
    Components({
      resolvers: [
        // 自动导入 element plus 组件
        ElementPlusResolver(),
        // 自动注册图标组件@iconify-json/ep
        IconsResolver({
          // prefix: 'i', // 默认：'i' 使用： {prefix}-{collection}-{icon}
          enabledCollections: [
            'ep'
          ],
        }),
      ],
    }),
    Icons({
      autoInstall: true, // 自动安装了 enabledCollections 指定的图标 如@iconify-json/ep
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
export default defineConfig({
  server: {
    open: true,
    host: true,
    proxy: {
      '/api': 'http://127.0.0.1:3000'
    }
  },
  plugins: [
    viteCompression({
      threshold: 1024000,
      verbose: true //时大于1mb的文件进行压宿
    }),
    vue(),
    createStyleImportPlugin({
      libs: [
        {
          libraryName: '@arco-design/web-vue',
          esModule: true,
          resolveStyle: (name) => {
            // less
            return `@arco-design/web-vue/es/${name}/style/index.js`
          }
        }
      ]
    }),
    AutoImport({
      resolvers: [ArcoResolver()]
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true
        })
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

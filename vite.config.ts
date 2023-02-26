import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true
  },
  plugins: [
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
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

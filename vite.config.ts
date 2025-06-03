import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue()
  ],
  server: {
    proxy: {
      '/api': 'http://162.14.82.204:8085',
      '/file': {
        target: 'http://162.14.82.204:8085',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/file/, '') // 去掉 /file 前缀
      },
      // '/api': 'http://localhost:8085',
      // '/file': {
      //   target: 'http://localhost:8085',
      //   changeOrigin: true,
      //   secure: false,
      //   rewrite: (path) => path.replace(/^\/file/, '') // 去掉 /file 前缀
      // }
    },
  },
})

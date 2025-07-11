import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// 获取当前模式下的环境变量
const mode = process.env.NODE_ENV
const env = loadEnv(mode, process.cwd())

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    nodePolyfills({
      globals: {
        global: true,
        Buffer: true,
        process: true
      },
      include: ['buffer', 'process', 'util'],
      exclude: [],
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: env.VITE_API_URL,
        changeOrigin: true,
        secure: false
      },
      '/file': {
        target: env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/file/, '')
      }
    },
  },
})
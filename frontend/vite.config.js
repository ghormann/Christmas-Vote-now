import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  server: {
    host: true,
    port: 8080,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    env: {
      VITE_API_BASE_URL: 'http://localhost:7654/api',
      VITE_WS_URL: 'ws://localhost:7654/ws',
    },
  },
})

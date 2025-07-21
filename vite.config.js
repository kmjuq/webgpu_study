import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // 将 @ 指向 src 目录
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
  ],
})

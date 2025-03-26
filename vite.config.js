import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: './index.html'
      },
      external: [
        'fs',
        'os',
        'child_process',
        'path',
        'util',
        'https',
        'http',
        'net'
      ],
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/echarts')) {
            return 'echarts'
          }
          if (id.includes('node_modules/systeminformation')) {
            return 'systeminfo'
          }
          if (id.includes('node_modules/vue') && 
              !id.includes('vue-draggable-next') && 
              !id.includes('vue-echarts') &&
              !id.includes('@vue/runtime-core')) {
            return 'vue-core'
          }
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})

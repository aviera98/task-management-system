import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    coverage: {
      exclude: [
        'src/main.tsx',
        'src/App.tsx',
        'src/assets/**',
        'src/test/**',
      ],
      provider: 'v8',
      reporter: ['text', 'html'],
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})

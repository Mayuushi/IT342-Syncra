import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
      process: 'process/browser',
      util: 'util'
    }
  },
  optimizeDeps: {
    include: [
      'crypto-browserify',
      'stream-browserify',
      'buffer',
      'process',
      'util'
    ]
  },
  define: {
    'process.env': {}
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()]
    }
  }
})

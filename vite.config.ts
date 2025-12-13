import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use relative URLs for assets so the app works when deployed to a subpath
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split heavy dependencies into separate chunks
        manualChunks: {
          // Three.js ecosystem - loaded only when 3D viewer is needed
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // Framer Motion - used throughout but can be separated
          'framer': ['framer-motion'],
          // React core
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Increase chunk size warning limit (Three.js is inherently large)
    chunkSizeWarningLimit: 600,
  },
})

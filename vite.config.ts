import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use relative URLs for assets so the app works when deployed to a subpath
  // (GitHub Pages, Netlify subpath, etc.).
  base: './',
  plugins: [react()],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Remove tailwindcss from here - it's not needed in Vite config
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist' // Explicitly set output directory
  }
})
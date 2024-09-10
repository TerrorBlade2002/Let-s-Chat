import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  base: './', // This ensures relative paths work properly in production
  build: {
    outDir: 'dist' // This is where Vite will output the build files
  }
})

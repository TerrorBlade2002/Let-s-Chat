import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
    server: {
      host: true,  // Set to true to allow access from your phone
      port: 5173,  // Ensure it's the correct port
    }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/study-materials-hub/', // <--- Replace with your actual repo name (e.g., '/study-hub/')
  plugins: [react(), tailwindcss()],
  // ...
})

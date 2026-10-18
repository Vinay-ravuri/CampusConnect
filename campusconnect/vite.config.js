import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward all /api requests to Spring Boot on port 8082
      // The configure block strips the Origin header so Spring Boot's
      // CORS filter sees the request as same-origin (no CORS block).
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Remove browser Origin so Spring Boot treats it as same-origin
            proxyReq.removeHeader('Origin')
            proxyReq.removeHeader('Referer')
            // Set origin to match Spring Boot's own host
            proxyReq.setHeader('Origin', 'http://localhost:8082')
          })
        },
      },
    },
  },
})

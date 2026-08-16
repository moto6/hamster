import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // 개발 서버(5173)에서 /api 를 백엔드(8080)로 프록시 → 브라우저 입장에선 same-origin.
  // 배포의 nginx(location /api/) 와 동일한 구조라, refresh HttpOnly 쿠키(path=/api/v0/auth)가
  // 개발/배포에서 같은 방식으로 동작한다.
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: false,
      },
    },
  },
})

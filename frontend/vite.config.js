import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/static': {
        target: 'http://localhost:8000', // Proxy static file requests to the backend
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8000', // Proxy API requests to the backend
        changeOrigin: true,
      },
    },
  },
});

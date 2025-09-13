import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    port: 15001,
    proxy: {
      // Proxy API requests to the backend during development
      '/api': {
        target: 'http://localhost:15000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // Define environment variables
  define: {
    'import.meta.env.VITE_API_URL': 
      process.env.NODE_ENV === 'production' 
        ? JSON.stringify('/api') 
        : JSON.stringify('http://localhost:15000/api')
  }
});

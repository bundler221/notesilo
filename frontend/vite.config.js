import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('=== VITE CONFIG DEBUG ===')
  console.log('Loaded env vars:', env)
  console.log('API Key from env:', env.VITE_INCOGNOIR_API_KEY)
  console.log('Environment ID from env:', env.VITE_INCOGNOIR_ENVIRONMENT_ID)
  console.log('========================')
  
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      __APP_ENV__: env.MODE
    },
    server: {
      host: true,
      port: 5173,
      allowedHosts: ['.ngrok-free.app'], // works for all ngrok links
      proxy: {
        '/api': {
          target: 'http://localhost:2001', // 👈 your backend
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})

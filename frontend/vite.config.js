import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  css: {
    // Tailwind 4 خودش از PostCSS استفاده می‌کنه، نیازی به پلاگین جداگانه نیست
  },
  build: {
    minify: 'esbuild', // کمینه سازی JS
    sourcemap: false, // اگر نیاز به debugging نداری
    cssCodeSplit: true, // CSS رو جدا کن برای caching بهتر
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          lucide: ['lucide-react'],
          virtualized: ['react-virtualized'],
          framer: ['framer-motion']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Optional: uncomment to analyze bundle size
    // visualizer({ open: true, gzipSize: true })
  ],
  
  // Build optimization
  build: {
    // Generate sourcemaps for production debugging
    sourcemap: false,
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunks - separate large dependencies
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'axios': ['axios'],
          
          // UI components
          'ui-components': [
            './src/components/Navbar',
            './src/components/Layout/Sidebar',
            './src/components/Layout/RightSidebar',
            './src/components/ResourceCard'
          ]
        },
        
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    }
  },
  
  // Server configuration
  server: {
    port: 5173,
    strictPort: false, // Try next available port if 5173 is taken
    open: false, // Don't auto-open browser
    proxy: {
      // Proxy API requests to backend during development
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'framer-motion'
    ],
    exclude: []
  },
  
  // CSS optimization
  css: {
    devSourcemap: true
  }
})

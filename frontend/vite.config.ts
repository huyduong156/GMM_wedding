import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { liveTemplateReleaseBundle } from './scripts/live-template-release-bundle-plugin.mjs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const apiTarget = env.VITE_DEV_API_TARGET ?? 'http://localhost:3000'

  return {
    plugins: [react(), liveTemplateReleaseBundle()],
    server: {
      port: 80,
      allowedHosts: ['ourday.asia.local', 'ourday.asia'],
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: false,
          headers: { origin: 'http://localhost:5173' },
        },
      },
    },
    preview: { port: 4173 },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            icons: ['@phosphor-icons/react'],
            motion: ['motion', 'lenis'],
            particles: ['@tsparticles/react', '@tsparticles/slim'],
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.ts',
    },
  }
})

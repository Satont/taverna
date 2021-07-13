import { createVuePlugin } from 'vite-plugin-vue2';
import { defineConfig } from 'vite';
import ViteComponents from 'vite-plugin-components';

import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

console.log(process.env.VITE_API_URL);

export default defineConfig({
  plugins: [createVuePlugin() /* , ViteComponents({ transformer: 'vue2' }) */],
  envDir: '../',
  build: {
    minify: 'esbuild',
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 4000,
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL ?? `http://localhost:${process.env.API_PORT}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

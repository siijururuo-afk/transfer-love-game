import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  publicDir: 'reboot/public',
  server: { allowedHosts: ['terminal.local'] },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
  },
});

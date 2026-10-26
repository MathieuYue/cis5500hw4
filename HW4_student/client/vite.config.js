import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Keep the same port Create React App used so existing instructions still apply
    port: 3000,
    open: true,
  },
});

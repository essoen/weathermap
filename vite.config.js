import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // For GitHub Pages: set base to repo name. Use '/' for custom domain.
  base: process.env.GITHUB_PAGES ? '/weathermap/' : '/',
});

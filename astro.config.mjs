import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  build: {
    format: 'directory',
    assets: 'assets',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

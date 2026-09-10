import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  integrations: [preact()],
  build: {
    format: 'directory',
    assets: 'assets',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

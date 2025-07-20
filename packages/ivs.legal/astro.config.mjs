import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import react from '@astrojs/react';
import AstroPWA from '@vite-pwa/astro'


export default defineConfig({
  site: 'https://dev.ivs.legal',
  integrations: [
    tailwind(),
    sitemap(),
    icon(),
    react(),
    AstroPWA({
      /* your pwa options */
      registerType: 'autoUpdate',
      manifest: {
        name: 'IVS Legal',
        short_name: 'IVS Legal',
        theme_color: '#B99A4B',
        background_color: '#222221',
        // screenshots: [
        //   {
        //     src: '/bg-1280x720.jpg',
        //     sizes: '1280x720',
        //     type: 'image/png',
        //     form_factor: 'wide',
        //   },
        //   {
        //     src: '/screenshot-narrow1.png',
        //     sizes: '864x1732',
        //     type: 'image/png',
        //     form_factor: 'narrow',
        //   },
        //   {
        //     src: '/screenshot-narrow2.png',
        //     sizes: '864x1732',
        //     type: 'image/png',
        //     form_factor: 'narrow',
        //   },
        //   {
        //     src: '/screenshot-narrow3.png',
        //     sizes: '864x1732',
        //     type: 'image/png',
        //     form_factor: 'narrow',
        //   },
        // ],
      },
      includeAssets: ['*.webp', '*.png', '*.jpg', '*.svg'],
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,webp,jpg}'],
      },
      pwaAssets: {
        image: 'public/favicon.png',
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
      devOptions: {
        enabled: false,
      },
    })
  ],
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
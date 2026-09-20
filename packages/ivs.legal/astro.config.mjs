import process from 'node:process'
import { defineConfig, envField } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import umami from '@yeskunall/astro-umami'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import react from '@astrojs/react'
import cloudflare from '@astrojs/cloudflare'
import markdownForAgents from '@puralex/astro-markdown-for-agents'
import AstroPWA from '@vite-pwa/astro'
import { notro } from 'notro-loader/integration'

export default defineConfig({
  site: 'https://ivs.legal',
  adapter: cloudflare({
    prerenderEnvironment: 'node',
    imageService: 'compile',
  }),
  session: false,
  // The sole dynamic endpoint checks every origin itself and returns JSON errors.
  // Astro's form-only check would intercept some requests with plain-text errors.
  security: { checkOrigin: false },
  image: {
    service: { entrypoint: './src/lib/build-image-service.ts' },
    responsiveStyles: true,
    remotePatterns: [{ protocol: 'https', hostname: '**.amazonaws.com' }],
  },
  env: {
    schema: {
      NOTION_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      NOTION_DATA_SOURCE_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
      TURNSTILE_SITE_KEY: envField.string({
        context: 'client',
        access: 'public',
        default:
          process.env.CLOUDFLARE_ENV === 'production'
            ? undefined
            : '1x00000000000000000000AA',
      }),
      GOOGLE_MAPS: envField.string({ context: 'client', access: 'public' }),
    },
  },
  integrations: [
    notro(),
    markdownForAgents({
      siteTitle: 'IVS Legal',
      siteDescription:
        'Informação jurídica e serviços de advocacia em Portugal. / Legal information and services in Portugal.',
    }),
    umami({
      id: 'ccd49192-101e-4047-82f5-275fbbd2b877',
      endpointUrl: 'https://stats.hugomrdias.dev',
    }),
    sitemap(),
    icon(),
    react(),
    AstroPWA({
      // Keep retirement mode available so returning visitors remove their old worker and caches.
      selfDestroying: true,
      outDir: 'dist/client',
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
        globPatterns: ['**/*.{css,js,html,svg,png,ico,webp,jpg,txt,xml}'],
      },
      pwaAssets: {
        image: 'public/favicon.png',
      },
      // experimental: {
      //   directoryAndTrailingSlashHandler: true,
      // },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})

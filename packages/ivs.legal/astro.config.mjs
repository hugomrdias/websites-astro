import process from 'node:process'
import { defineConfig, envField } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import umami from '@yeskunall/astro-umami'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import favicons from 'astro-favicons'
import react from '@astrojs/react'
import cloudflare from '@astrojs/cloudflare'
import markdownForAgents from '@puralex/astro-markdown-for-agents'
import { notro } from 'notro-loader/integration'

export default defineConfig({
  site: 'https://ivs.legal',
  redirects: {
    '/contacto': '/contact',
    '/politica-privacidade': '/privacy',
    '/termos-condicoes': '/terms',
    '/sobre': '/about',
    '/en/contacto': '/en/contact',
    '/en/politica-privacidade': '/en/privacy',
    '/en/termos-condicoes': '/en/terms',
    '/en/sobre': '/en/about',
  },
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
    favicons({
      input: 'public/favicon.png',
      name: 'IVS Legal',
      short_name: 'IVS Legal',
      themes: ['#B99A4B', '#B99A4B'],
      background: '#222221',
      manifest: {
        display: 'browser',
        display_override: ['browser'],
        start_url: '/',
        lang: 'pt',
      },
      withCapo: false,
    }),
    react(),
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

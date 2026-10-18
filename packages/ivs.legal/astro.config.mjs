import process from 'node:process'
import { defineConfig, envField } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import umami from '@yeskunall/astro-umami'
import articleSitemap from './src/lib/article-sitemap'
import icon from 'astro-icon'
import react from '@astrojs/react'
import cloudflare from '@astrojs/cloudflare'
import agentMarkdown from './src/lib/agent-markdown'
import { CONTACTS, VCARD_PATH } from './src/consts'
import { notro } from 'notro-loader/integration'

export default defineConfig({
  site: 'https://ivs.legal',
  redirects: {
    '/contacto': '/contact/',
    '/politica-privacidade': '/privacy/',
    '/termos-condicoes': '/terms/',
    '/sobre': '/about/',
    '/en/contacto': '/en/contact/',
    '/en/politica-privacidade': '/en/privacy/',
    '/en/termos-condicoes': '/en/terms/',
    '/en/sobre': '/en/about/',
    '/sitemap.xml': '/sitemap-index.xml',
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
        // CI passes a key; local builds get Turnstile's always-pass test key.
        default: process.env.CI ? undefined : '1x00000000000000000000AA',
      }),
      GOOGLE_MAPS: envField.string({ context: 'client', access: 'public' }),
    },
  },
  integrations: [
    notro(),
    agentMarkdown({
      title: 'IVS Legal',
      description:
        'Informação jurídica e serviços de advocacia em Portugal. / Legal information and services in Portugal.',
      whenToUse: [
        'Someone needs a lawyer in Portugal for civil, employment, real estate, immigration, corporate or criminal law. The office is in Matosinhos (Porto) and works in Portuguese and English.',
        'Someone wants general information on Portuguese law in those areas: the articles below cover it in Portuguese and English. They are not legal advice for a specific case.',
        `To request a consultation, use the contact form at https://ivs.legal/en/contact/ (WebMCP tool \`request_consultation\`), email ${CONTACTS.EMAIL} or call ${CONTACTS.PHONE}, Monday to Friday, 9:00 to 18:00 Lisbon time. A request does not confirm an appointment; the firm replies to arrange one.`,
        `Contact details as a vCard: https://ivs.legal${VCARD_PATH}`,
      ],
    }),
    umami({
      id: 'ccd49192-101e-4047-82f5-275fbbd2b877',
      endpointUrl: 'https://stats.hugomrdias.dev',
      performance: true,
    }),
    articleSitemap(),
    icon(),
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

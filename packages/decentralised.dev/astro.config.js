import { defineConfig, envField } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { h } from 'hastscript'
import expressiveCode from 'astro-expressive-code'
import ecTwoSlash from 'expressive-code-twoslash'
import { remarkAlert } from 'remark-github-blockquote-alert'
import remarkDirective from 'remark-directive'
import remarkDirectiveSugar from 'remark-directive-sugar'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLinks from 'rehype-external-links'
import embeds from 'astro-embed/integration'
import AstroPWA from '@vite-pwa/astro'
import rehypeMermaid from 'rehype-mermaid'
import icon from 'astro-icon'
import react from '@astrojs/react'

// https://astro.build/config

export default defineConfig({
  site: 'https://decentralised.dev',
  image: {
    domains: ['github.com', 't1.gstatic.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  integrations: [
    mdx(),
    sitemap(),
    icon(),
    AstroPWA({
      /* your pwa options */
      registerType: 'autoUpdate',
      manifest: {
        name: 'Decentralised Experience',
        short_name: 'Decentralised Experience',
        theme_color: '#25201a',
        background_color: '#191918',
      },
      includeAssets: ['*.webp', '*.png', '*.jpg', '*.svg'],
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,webp,jpg,txt,xml}'],
      },
      pwaAssets: {
        image: 'public/logo.png',
      },
      devOptions: {
        enabled: false,
      },
    }),
    react(),
  ],
  vite: {
    preview: {
      allowedHosts: ['.trycloudflare.com'],
    },
    server: {
      allowedHosts: ['.trycloudflare.com'],
    },
  },
})

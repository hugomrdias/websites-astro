import { defineConfig, envField } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { h } from 'hastscript'
import { remarkReadingTime } from './src/lib/remark-reading-time.js'
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

// https://astro.build/config

export default defineConfig({
  site: 'https://hugodias.me',
  image: {
    domains: ['github.com', 't1.gstatic.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  env: {
    schema: {
      NOTION_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      NOTION_DATABASE_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
    validateSecrets: true,
  },
  integrations: [
    embeds(),
    expressiveCode({
      plugins: [ecTwoSlash()],
      themes: ['slack-dark', 'one-light'],
      styleOverrides: {
        twoSlash: {
          cursorColor: 'red',
        },
        frames: {
          frameBoxShadowCssValue: 'none',
        },
      },
    }),
    mdx(),
    sitemap(),
    icon(),
    AstroPWA({
      /* your pwa options */
      registerType: 'autoUpdate',
      manifest: {
        name: 'Hugo Dias - Writing code for Web3.',
        short_name: 'Hugo Dias',
        theme_color: '#25201a',
        background_color: '#191918',
        screenshots: [
          {
            src: '/bg-1280x720.jpg',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: '/screenshot-narrow1.png',
            sizes: '864x1732',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: '/screenshot-narrow2.png',
            sizes: '864x1732',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: '/screenshot-narrow3.png',
            sizes: '864x1732',
            type: 'image/png',
            form_factor: 'narrow',
          },
        ],
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
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkReadingTime,
      remarkAlert,
      remarkDirective,
      [
        remarkDirectiveSugar,
        {
          image: {
            figureProps: { className: 'Lightbox' },
          },
        },
      ],
    ],
    rehypePlugins: [
      [rehypeMermaid, { strategy: 'img-svg', dark: true }],
      [
        rehypeExternalLinks,
        {
          target: '_blank',
        },
      ],
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { class: 'header-anchor' },
          content() {
            return [
              h(
                'span.icon.icon-link',
                { ariaHidden: 'true' },
                h(
                  'svg',
                  {
                    width: '16',
                    height: '16',
                    viewBox: '0 0 24 24',
                  },
                  h('path', {
                    fill: 'currentcolor',
                    d: 'm12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z',
                  })
                )
              ),
            ]
          },
        },
      ],
    ],
  },
  vite: {
    preview: {
      allowedHosts: ['.trycloudflare.com'],
    },
    server: {
      allowedHosts: ['.trycloudflare.com'],
    },
  },
})

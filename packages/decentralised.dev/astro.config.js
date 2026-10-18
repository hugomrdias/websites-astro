import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
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
  integrations: [mdx(), sitemap(), icon(), react()],
  vite: {
    preview: {
      allowedHosts: ['.trycloudflare.com'],
    },
    server: {
      allowedHosts: ['.trycloudflare.com'],
    },
  },
})

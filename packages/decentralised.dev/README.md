# hugodias.me

This is a [Astro](https://astro.build/) project.

## Usage

```bash
pnpm  install
pnpx playwright install --with-deps chromium
```

## Icons

`pnpm favicons` generates the icons in `public/` from `public/logo.png` with [`@vite-pwa/assets-generator`](https://vite-pwa-org.netlify.app/assets-generator/) (`pwa-assets.config.ts`). The icons are committed; rerun it only when the image changes. `public/manifest.webmanifest` is written by hand.

`public/sw.js` unregisters the service worker the site used to install and clears its caches. Keep serving it at `/sw.js` for visitors who still have the old worker.

## Astro References

https://github.com/delucis/astro-og-canvas
https://github.com/shishkin/astro-pagefind
https://www.opengraph.xyz/

import {
  defaultAssetName,
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

// Run `pnpm favicons` after replacing public/favicon.png, then commit the icons.
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    // iOS and link previews look for /apple-touch-icon.png by convention.
    assetName: (type, size) =>
      type === 'apple' ? 'apple-touch-icon.png' : defaultAssetName(type, size),
  },
  images: ['public/favicon.png'],
})

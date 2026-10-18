import {
  defaultAssetName,
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

// Run `pnpm favicons` after replacing public/favicon.png, then commit the icons.
const background = { resizeOptions: { background: '#222221' } }

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, ...background },
    apple: { ...minimal2023Preset.apple, ...background },
    // iOS and link previews look for /apple-touch-icon.png by convention.
    assetName: (type, size) =>
      type === 'apple' ? 'apple-touch-icon.png' : defaultAssetName(type, size),
  },
  images: ['public/favicon.png'],
})

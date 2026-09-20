import { rm } from 'node:fs/promises'

// Cloudflare's Vite plugin may write declared Worker secrets available locally
// to a .dev.vars file for preview. Remove it before packaging build artifacts.
// No file is emitted when no matching local secrets are found (force allows this).
await rm('dist/server/.dev.vars', { force: true })

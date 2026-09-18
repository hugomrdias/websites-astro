/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/pwa-assets" />
/// <reference types="vite-plugin-pwa/vanillajs" />

declare module 'virtual:pwa-register' {
  export function registerSW(options?: {
    immediate?: boolean
    onRegisteredSW?: (swScriptUrl: string) => void
    onOfflineReady?: () => void
  }): (reloadPage?: boolean) => Promise<void>
}

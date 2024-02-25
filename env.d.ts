/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

// eslint-disable-next-line unicorn/prevent-abbreviations
interface ImportMetaEnvironment {
  readonly VITE_APP_TITLE: string
  readonly VITE_APIKEY: string
  readonly VITE_AUTHDOMAIN: string
  readonly VITE_PROJECT_ID: string
  readonly VITE_STORAGE_BUCKET: string
  readonly VITE_MESSAGING_SENDER_ID: string
  readonly VITE_APPID: string
  readonly hot: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnvironment
}

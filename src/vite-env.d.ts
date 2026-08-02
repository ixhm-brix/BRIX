/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ASSISTANT_URL?: string
  readonly VITE_ASSISTANT_KEY?: string
  readonly VITE_WHATSAPP_NUMBER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

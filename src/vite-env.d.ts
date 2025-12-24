/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODEL_URL?: string
  readonly VITE_MODEL_PREVIEW?: string
  readonly VITE_SKETCHFAB_UID?: string
  readonly VITE_MODEL_LICENSE_HTML?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
